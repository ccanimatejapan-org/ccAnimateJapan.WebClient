<template>
  <section class="section narrow-section checkout">
    <header class="page-head">
      <p class="eyebrow">{{ t('checkout.eyebrow') }}</p>
      <h1>{{ t('checkout.title') }}</h1>
      <p class="page-head__desc">{{ t('checkout.subtitle') }}</p>
    </header>

    <div v-if="ready" class="checkout__layout">
      <div class="checkout__main">
        <div class="checkout__block panel">
          <h2 class="panel__title">{{ t('checkout.chooseMethod') }}</h2>
          <DeliveryMethodPicker v-model="selectedMethodId" :delivery-types="deliveryTypes" />
        </div>

        <div class="checkout__block panel">
          <h2 class="panel__title">{{ t('checkout.chooseAddress') }}</h2>
          <template v-if="needsAddress">
            <AddressPicker v-model="selectedAddressId" :addresses="methodAddresses" />
            <div v-if="usingNew" class="checkout__new-address">
              <input
                class="checkout__field"
                v-model="newAddress"
                :placeholder="addressPlaceholder"
                :aria-label="t('checkout.chooseAddress')"
              />
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
          <p v-else class="notice">
            <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0" /></svg>
            <span>{{ t('checkout.noAddressNeeded') }}</span>
          </p>
        </div>

        <div class="checkout__block panel">
          <h2 class="panel__title">
            <label for="checkout-recipient-phone">{{ t('checkout.recipientPhone') }}</label>
          </h2>
          <input
            id="checkout-recipient-phone"
            class="checkout__field"
            v-model="recipientPhone"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
          />
        </div>
      </div>

      <aside class="checkout__summary panel">
        <h2 class="panel__title">{{ t('checkout.summary') }}</h2>
        <div class="checkout__groups">
          <div
            v-for="group in cart.groups"
            :key="group.activityId"
            class="checkout__group"
          >
            <div class="summary-row checkout__group-row">
              <span>{{ group.activityName || t("activity.unnamed") }}</span>
              <AppPrice :value="group.subtotal" />
            </div>
            <OfficialShippingCard
              class="checkout__group-shipping"
              :is-pre-order="group.activityIsPreOrder"
              :start-time="group.officialShippingStartTime"
              :end-time="group.officialShippingEndTime"
              variant="compact"
            />
          </div>
        </div>
        <p v-if="cart.groups.length" class="notice">
          {{ t('checkout.splitNotice', { count: cart.groups.length }) }}
        </p>
        <div class="summary-row">
          <span>{{ t('cart.totalQuantity') }}</span>
          <strong>{{ cart.totalQuantity }}</strong>
        </div>
        <div class="summary-row checkout__total">
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
import OfficialShippingCard from '@/shared/components/OfficialShippingCard.vue';
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
  await cart.ensureHydrated();

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
    const result = await createOrderFromCartItems(cart.items, shipping);
    const orders = Array.isArray(result?.orders) ? result.orders : [];
    const failures = Array.isArray(result?.failures) ? result.failures : [];

    if (orders.length > 0) {
      ui.showToast({
        title: t('cart.toast.orderCreatedTitle'),
        message: t('cart.toast.ordersCreatedMessage', { count: orders.length }),
        actionLabel: t('order.viewOrders'),
        actionTo: { name: ROUTE_NAMES.ORDER_LIST }
      });

      if (failures.length > 0) {
        showPartialFailureToast(failures, { queue: true });
      }

      await cart.hydrate();
      router.push({ name: ROUTE_NAMES.ORDER_LIST });
      return;
    }

    if (failures.length > 0) {
      showPartialFailureToast(failures);
    } else {
      ui.showToast({
        type: 'warning',
        title: t('cart.toast.submitFailedTitle'),
        message: t('cart.toast.submitFailedMessage')
      });
    }
    await cart.hydrate();
    router.push({ name: ROUTE_NAMES.CART });
  } catch (error) {
    if (error.message === 'PROFILE_INCOMPLETE') {
      ui.showToast({ title: t('member.profile'), message: t('member.completeProfileFirst') });
      router.replace({ name: ROUTE_NAMES.MEMBER_PROFILE });
      return;
    }
    await cart.hydrate();
    ui.showToast({
      type: 'warning',
      title: t('cart.toast.submitFailedTitle'),
      message: t('cart.toast.submitFailedMessage')
    });
  } finally {
    isSubmitting.value = false;
  }
}

function showPartialFailureToast(failures, options = {}) {
  const names = failures
    .map((failure) => failure.activityName || failure.activityId || t('activity.unnamed'))
    .join('、');

  ui.showToast({
    type: 'warning',
    queue: Boolean(options.queue),
    title: t('cart.toast.submitFailedTitle'),
    message: t('checkout.partialFailureMessage', { names }),
    duration: 5200
  });
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
  min-width: 0;
  display: grid;
  gap: 16px;
}

.checkout__block {
  display: grid;
  gap: 12px;
}

.checkout__block .panel__title {
  margin: 0;
}

.checkout__new-address {
  display: grid;
  gap: 10px;
}

.checkout__field {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid $color-border;
  border-radius: $radius-control;
  background: $color-paper;
  color: $color-ink;
  font-size: 16px;
}

.checkout__field:focus {
  border-color: #b98f42;
  box-shadow: 0 0 0 3px rgba(245, 207, 102, 0.35);
  outline: none;
}

.checkout__save {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: $color-ink;
  font-size: 0.87rem;
  cursor: pointer;
}

.checkout__save input {
  width: 20px;
  height: 20px;
  accent-color: #b98f42;
}

.checkout__summary {
  display: grid;
  gap: 10px;
}

.checkout__summary .panel__title {
  margin-bottom: 4px;
}

.checkout__groups {
  display: grid;
  gap: 12px;
}

.checkout__group {
  display: grid;
  gap: 8px;
}

.checkout__group-row {
  padding-top: 0;
  border-bottom: 0;
  padding-bottom: 0;
}

.checkout__group-row span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.checkout__group-shipping {
  align-self: start;
}

.checkout__total {
  align-items: center;
  border-bottom: 0;
}

.checkout__total .app-price {
  font-size: 1.3rem;
}

.checkout__submit {
  width: 100%;
  margin-top: 4px;
}

@media (min-width: 860px) {
  .checkout__layout {
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 24px;
  }

  .checkout__summary {
    position: sticky;
    top: 24px;
  }
}
</style>
