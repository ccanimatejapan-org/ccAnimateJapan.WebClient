<template>
  <section class="section narrow-section checkout">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('checkout.eyebrow') }}</p>
        <h1>{{ t('checkout.title') }}</h1>
      </div>
    </div>

    <div v-if="ready" class="checkout__layout">
      <div class="checkout__main">
        <div class="checkout__block">
          <h2>{{ t('checkout.chooseMethod') }}</h2>
          <DeliveryMethodPicker v-model="selectedMethodId" :delivery-types="deliveryTypes" />
        </div>

        <div class="checkout__block">
          <h2>{{ t('checkout.chooseAddress') }}</h2>
          <template v-if="needsAddress">
            <AddressPicker v-model="selectedAddressId" :addresses="methodAddresses" />
            <div v-if="usingNew" class="checkout__new-address">
              <input class="checkout__field" v-model="newAddress" :placeholder="addressPlaceholder" />
              <label class="checkout__save">
                <input v-model="saveAddress" type="checkbox" />
                <span>{{ t('checkout.saveAsAddress') }}</span>
              </label>
              <input
                v-if="saveAddress"
                class="checkout__field"
                v-model="newAddressName"
                :placeholder="labelPlaceholder"
                :aria-label="t('member.label')"
              />
            </div>
          </template>
          <p v-else class="checkout__hint">{{ t('checkout.noAddressNeeded') }}</p>
        </div>

        <div class="checkout__block">
          <h2>{{ t('checkout.recipientPhone') }}</h2>
          <input class="checkout__field" v-model="recipientPhone" type="tel" />
        </div>
      </div>

      <aside class="checkout__summary">
        <h2>{{ t('checkout.summary') }}</h2>
        <div class="summary-row">
          <span>{{ t('cart.activity') }}</span>
          <strong>{{ cart.activityName }}</strong>
        </div>
        <div class="summary-row">
          <span>{{ t('cart.totalQuantity') }}</span>
          <strong>{{ cart.totalQuantity }}</strong>
        </div>
        <div class="summary-row">
          <span>{{ t('cart.subtotal') }}</span>
          <AppPrice :value="cart.subtotal" />
        </div>
        <AppButton class="checkout__submit" :disabled="isSubmitting" @click="placeOrder">
          {{ isSubmitting ? t('checkout.submitting') : t('checkout.placeOrder') }}
        </AppButton>
      </aside>
    </div>
    <AppLoading v-else :label="t('common.loading')" />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { ADDRESS_KIND, requiresAddress } from '@/shared/constants/addressKind';
import { useUiStore } from '@/shared/stores/uiStore';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import { getAddresses, getDeliveryTypes, getProfile } from '@/modules/member/api/memberApi';
import { createOrderFromCartItems } from '@/modules/order/api/orderApi';
import DeliveryMethodPicker from '../components/DeliveryMethodPicker.vue';
import AddressPicker from '../components/AddressPicker.vue';

const router = useRouter();
const { t } = useI18n();
const ui = useUiStore();
const cart = useCartStore();

const ready = ref(false);
const isSubmitting = ref(false);
const deliveryTypes = ref([]);
const addresses = ref([]);
const profile = ref(null);

const selectedMethodId = ref(null);
const selectedAddressId = ref(0);
const newAddress = ref('');
const newAddressName = ref('');
const saveAddress = ref(false);
const recipientPhone = ref('');

const selectedMethod = computed(() => deliveryTypes.value.find((type) => type.id === selectedMethodId.value) || null);
const selectedKind = computed(() => selectedMethod.value?.addressKind ?? ADDRESS_KIND.NONE);
const needsAddress = computed(() => requiresAddress(selectedKind.value));
const methodAddresses = computed(() =>
  addresses.value.filter((address) => address.deliveryTypeId === selectedMethodId.value)
);
const usingNew = computed(() => selectedAddressId.value === 0);
const addressPlaceholder = computed(() =>
  selectedKind.value === ADDRESS_KIND.STORE_PICKUP ? t('member.addressHint.store') : t('member.addressHint.home')
);
const labelPlaceholder = computed(() =>
  selectedKind.value === ADDRESS_KIND.STORE_PICKUP ? t('member.labelHint.store') : t('member.labelHint.home')
);

watch(selectedMethodId, () => {
  const preferred = methodAddresses.value.find((address) => address.isDefault) || methodAddresses.value[0];
  selectedAddressId.value = preferred ? preferred.id : 0;
  newAddress.value = '';
  newAddressName.value = '';
  saveAddress.value = false;
});

onMounted(async () => {
  if (!cart.items.length) {
    router.replace({ name: ROUTE_NAMES.CART });
    return;
  }

  try {
    const [types, profileData, addressList] = await Promise.all([getDeliveryTypes(), getProfile(), getAddresses()]);
    deliveryTypes.value = types;
    profile.value = profileData;
    addresses.value = addressList;
  } catch (error) {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.loadFailed') });
    return;
  }

  if (!profile.value?.email || !profile.value?.name || !profile.value?.phone) {
    ui.showToast({ title: t('member.profile'), message: t('member.completeProfileFirst') });
    router.replace({ name: ROUTE_NAMES.MEMBER_PROFILE });
    return;
  }

  recipientPhone.value = profile.value.phone || '';
  selectedMethodId.value = deliveryTypes.value[0]?.id ?? null;
  ready.value = true;
});

async function placeOrder() {
  if (isSubmitting.value || !cart.items.length) return;

  if (!selectedMethodId.value) {
    ui.showToast({ title: t('checkout.title'), message: t('checkout.chooseMethod') });
    return;
  }

  if (needsAddress.value) {
    const missingNew = usingNew.value && !newAddress.value.trim();
    const missingSaved = !usingNew.value && !selectedAddressId.value;
    if (missingNew || missingSaved) {
      ui.showToast({ title: t('checkout.title'), message: t('checkout.selectAddress') });
      return;
    }
  }

  const shipping = {
    deliveryTypeId: selectedMethodId.value,
    recipientPhone: recipientPhone.value.trim() || null
  };

  if (needsAddress.value) {
    if (usingNew.value) {
      shipping.address = newAddress.value.trim();
      shipping.saveAddress = saveAddress.value;
      shipping.addressName = saveAddress.value ? newAddressName.value.trim() || null : null;
    } else {
      shipping.addressId = selectedAddressId.value;
    }
  }

  isSubmitting.value = true;
  try {
    const order = await createOrderFromCartItems(cart.items, shipping);
    cart.clearCart();
    ui.showToast({
      title: t('cart.toast.orderCreatedTitle'),
      message: t('cart.toast.orderCreatedMessage', { orderNo: order.orderNo }),
      actionLabel: t('order.viewOrders'),
      actionTo: { name: ROUTE_NAMES.ORDER_LIST }
    });
    router.push({ name: ROUTE_NAMES.ORDER_LIST });
  } catch (error) {
    if (error.message === 'PROFILE_INCOMPLETE') {
      ui.showToast({ title: t('member.profile'), message: t('member.completeProfileFirst') });
      router.replace({ name: ROUTE_NAMES.MEMBER_PROFILE });
      return;
    }
    ui.showToast({ title: t('cart.toast.submitFailedTitle'), message: t('cart.toast.submitFailedMessage') });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.checkout__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;
}

.checkout__main {
  display: grid;
  gap: 16px;
}

.checkout__block {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid rgba(234, 216, 204, 0.74);
  border-radius: 16px;
  background: rgba(255, 253, 249, 0.72);
}

.checkout__block h2 {
  margin: 0;
  font-size: 1.05rem;
}

.checkout__new-address {
  display: grid;
  gap: 10px;
}

.checkout__field {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid $color-border;
  border-radius: 14px;
  background: #fffdf9;
  color: $color-ink;
}

.checkout__field:focus {
  border-color: $color-primary;
  box-shadow: 0 0 0 4px rgba(184, 121, 22, 0.12);
  outline: none;
}

.checkout__save {
  display: flex;
  align-items: center;
  gap: 8px;
  color: $color-muted;
  font-weight: 600;
}

.checkout__save input {
  width: 18px;
  height: 18px;
  accent-color: $color-primary;
}

.checkout__hint {
  margin: 0;
  color: $color-muted;
}

.checkout__summary {
  display: grid;
  gap: 10px;
  padding: 18px;
  border: 1px solid rgba(234, 216, 204, 0.74);
  border-radius: 16px;
  background: #fff;
}

.checkout__summary h2 {
  margin: 0;
  font-size: 1.05rem;
}

.checkout__submit {
  margin-top: 6px;
  width: 100%;
}

@media (min-width: 860px) {
  .checkout__layout {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 24px;
  }

  .checkout__summary {
    position: sticky;
    top: 84px;
  }
}
</style>
