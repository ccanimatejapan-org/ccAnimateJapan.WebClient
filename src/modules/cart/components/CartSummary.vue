<template>
  <aside class="cart-summary">
    <h2>{{ t('cart.summary') }}</h2>
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
    <AppButton :disabled="isSubmitting" @click="$emit('submit')">
      {{ isSubmitting ? t('cart.submitting') : t('cart.submitOrder') }}
    </AppButton>
  </aside>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { useCartStore } from '../stores/cartStore';

defineProps({
  isSubmitting: {
    type: Boolean,
    default: false
  }
});

defineEmits(['submit']);

const { t } = useI18n();
const cart = useCartStore();
</script>

<style scoped lang="scss">
@use '../styles/cart-summary';
</style>
