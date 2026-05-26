<template>
  <aside class="cart-summary">
    <h2>{{ t('cart.summary') }}</h2>
    <div class="summary-row">
      <span>{{ t('cart.subtotal') }}</span>
      <AppPrice :value="cart.subtotal" />
    </div>
    <RouterLink class="app-button app-button--primary" :to="{ name: ROUTE_NAMES.CHECKOUT_INFO }">
      {{ t('cart.checkout') }}
    </RouterLink>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppPrice from '@/shared/components/AppPrice.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '../stores/cartStore';

const { t } = useI18n();
const cart = useCartStore();
</script>

<style scoped lang="scss">
@use '../styles/cart-summary';
</style>
