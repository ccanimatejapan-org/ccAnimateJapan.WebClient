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
        <section v-for="group in cart.groups" :key="group.activityId" class="cart-group">
          <div class="cart-group__header">
            <h2>{{ group.activityName || t('activity.unnamed') }}</h2>
            <AppPrice :value="group.subtotal" />
          </div>
          <CartItem v-for="item in group.items" :key="item.id" :item="item" />
        </section>
      </div>
      <CartSummary @submit="goCheckout" />
    </div>

    <AppEmpty v-else :message="t('cart.empty')">
      <RouterLink class="app-button app-button--primary" :to="{ name: ROUTE_NAMES.HOME }">
        {{ t('cart.goShopping') }}
      </RouterLink>
    </AppEmpty>
  </section>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import CartItem from '../components/CartItem.vue';
import CartSummary from '../components/CartSummary.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '../stores/cartStore';

const router = useRouter();
const { t } = useI18n();
const cart = useCartStore();

function goCheckout() {
  if (!cart.items.length) return;
  router.push({ name: ROUTE_NAMES.CHECKOUT });
}
</script>

<style scoped lang="scss">
@use '../styles/cart-page';
</style>
