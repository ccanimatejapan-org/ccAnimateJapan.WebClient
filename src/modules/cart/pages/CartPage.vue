<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('cart.eyebrow') }}</p>
        <h1>{{ t('cart.title') }}</h1>
      </div>
    </div>

    <div v-if="cart.items.length" class="cart-layout">
      <div class="cart-list">
        <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
      </div>
      <CartSummary />
    </div>

    <AppEmpty v-else :message="t('cart.empty')">
      <RouterLink class="app-button app-button--primary" :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">
        {{ t('cart.goShopping') }}
      </RouterLink>
    </AppEmpty>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import CartItem from '../components/CartItem.vue';
import CartSummary from '../components/CartSummary.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '../stores/cartStore';

const { t } = useI18n();
const cart = useCartStore();
</script>

<style scoped lang="scss">
@use '../styles/cart-page';
</style>
