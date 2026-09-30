<template>
  <article class="cart-item">
    <img :src="item.imageUrl" :alt="item.productName" />
    <div class="cart-item__body">
      <h3>{{ item.productName }}</h3>
      <p v-if="item.note" class="cart-item__note">{{ item.note }}</p>
      <p class="cart-item__unit">
        {{ t('cart.unitPrice') }} <AppPrice :value="item.price" />
      </p>
      <div class="cart-item__actions">
        <QuantityControl
          :model-value="localQty"
          :max="maxQuantity"
          @update:model-value="onQty"
          @limit-reached="showQuantityLimitToast"
        />
        <AppPrice class="cart-item__subtotal" :value="item.price * localQty" />
      </div>
      <button type="button" class="cart-item__remove" @click="isConfirmingRemove = true">
        <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg>
        {{ t('common.remove') }}
      </button>
    </div>

    <AppModal v-model="isConfirmingRemove" :title="t('cart.removeConfirmTitle')" fit-content>
      <p class="cart-item__confirm-text">{{ t('cart.removeConfirmMessage', { name: item.productName }) }}</p>
      <div class="cart-item__confirm-actions">
        <AppButton variant="secondary" @click="isConfirmingRemove = false">{{ t('common.cancel') }}</AppButton>
        <AppButton variant="dark" @click="confirmRemove">{{ t('common.remove') }}</AppButton>
      </div>
    </AppModal>
  </article>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppModal from '@/shared/components/AppModal.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { debounce } from '@/shared/utils/debounce';
import { useUiStore } from '@/shared/stores/uiStore';
import { MAX_ORDER_QUANTITY } from '@/shared/constants/quantity';
import QuantityControl from './QuantityControl.vue';
import { useCartStore } from '../stores/cartStore';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();
const cart = useCartStore();
const ui = useUiStore();
const localQty = ref(props.item.quantity);
const isConfirmingRemove = ref(false);
const maxQuantity = computed(() => {
  const otherQuantity = cart.items.reduce((total, item) => {
    if (item.productId !== props.item.productId || item.id === props.item.id) return total;
    return total + item.quantity;
  }, 0);
  return Math.max(1, MAX_ORDER_QUANTITY - otherQuantity);
});
let pending = false;
let editSeq = 0;

function showActionFailedToast() {
  ui.showToast({
    title: t('cart.toast.actionFailedTitle'),
    message: t('cart.toast.actionFailedMessage')
  });
}

function showQuantityLimitToast() {
  ui.showToast({
    title: t('cart.toast.quantityLimitTitle'),
    message: t('cart.toast.quantityLimitMessage')
  });
}

const sync = debounce(async (id, quantity, seq) => {
  const result = await cart.updateQuantity(id, quantity);

  if (!result.ok) {
    if (result.reason === 'quantityLimit') showQuantityLimitToast();
    else showActionFailedToast();
  }

  if (seq === editSeq) {
    pending = false;
    if (result.ok) {
      localQty.value = quantity;
    } else {
      await nextTick();
      localQty.value = props.item.quantity;
    }
  }
}, 350);

function onQty(value) {
  editSeq += 1;
  pending = true;
  localQty.value = value;
  sync(props.item.id, value, editSeq);
}

function confirmRemove() {
  isConfirmingRemove.value = false;
  onRemove();
}

async function onRemove() {
  sync.cancel();
  pending = false;
  const result = await cart.removeItem(props.item.id);

  if (!result.ok) {
    showActionFailedToast();
  }
}

watch(() => props.item.quantity, (quantity) => {
  if (!pending) {
    localQty.value = quantity;
  }
});

onBeforeUnmount(() => {
  sync.cancel();
});
</script>

<style scoped lang="scss">
@use '../styles/cart-item';
</style>
