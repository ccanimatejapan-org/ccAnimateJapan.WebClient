<template>
  <article class="cart-item">
    <img :src="item.imageUrl" :alt="item.productName" />
    <div class="cart-item__body">
      <p>{{ item.activityName }}</p>
      <h3>{{ item.productName }}</h3>
      <span v-if="item.note">{{ item.note }}</span>
      <div class="cart-item__price-row">
        <span>{{ t('cart.unitPrice') }}</span>
        <AppPrice :value="item.price" />
      </div>
      <div class="cart-item__price-row">
        <span>{{ t('cart.lineSubtotal') }}</span>
        <AppPrice :value="item.price * localQty" />
      </div>
    </div>
    <QuantityControl
      :model-value="localQty"
      :max="maxQuantity"
      @update:model-value="onQty"
      @limit-reached="showQuantityLimitToast"
    />
    <button type="button" class="text-button" @click="onRemove">
      {{ t('common.remove') }}
    </button>
  </article>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
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
