<template>
  <aside class="cart-summary panel">
    <h2 class="panel__title">{{ t('cart.summary') }}</h2>
    <div class="summary-row">
      <span>{{ t('cart.selectedActivities') }}</span>
      <strong>{{ cart.selection.activityCount }}</strong>
    </div>
    <div class="summary-row">
      <span>{{ t('cart.totalQuantity') }}</span>
      <strong>{{ cart.selection.totalQuantity }}</strong>
    </div>
    <div class="summary-row cart-summary__total">
      <span>{{ t('cart.subtotal') }}</span>
      <AppPrice :value="cart.selection.subtotal" />
    </div>
    <p v-if="cart.selection.activityCount" class="cart-summary__hint">{{ t('cart.shippingHint') }}</p>
    <p v-else-if="cart.selectableIds.length" class="cart-summary__hint cart-summary__hint--warn">{{ t('cart.selectToCheckout') }}</p>
    <p v-else class="cart-summary__hint cart-summary__hint--warn">{{ t('cart.nothingSelectable') }}</p>
    <AppButton class="cart-summary__submit" :disabled="!cart.selection.activityCount" @click="$emit('submit')">
      {{ t('checkout.goCheckout') }}
    </AppButton>
  </aside>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { useCartStore } from '../stores/cartStore';

defineEmits(['submit']);

const { t } = useI18n();
const cart = useCartStore();
</script>

<style scoped lang="scss">
@use '../styles/cart-summary';
</style>
