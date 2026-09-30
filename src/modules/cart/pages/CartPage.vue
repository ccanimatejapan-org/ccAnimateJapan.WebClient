<template>
  <section class="section">
    <header class="page-head">
      <p class="eyebrow">{{ t('cart.eyebrow') }}</p>
      <h1>{{ t('cart.title') }}</h1>
      <p class="page-head__desc">{{ t('cart.subtitle') }}</p>
    </header>

    <div v-if="cart.items.length" class="cart-layout">
      <div class="cart-list">
        <p v-if="cart.groups.length > 1" class="notice">
          <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0" /></svg>
          <span>{{ t('cart.splitNotice', { count: cart.groups.length }) }}</span>
        </p>
        <section v-for="group in cart.groups" :key="group.activityId" class="cart-group panel">
          <div class="cart-group__header">
            <h2>{{ group.activityName || t('activity.unnamed') }}</h2>
            <AppPrice :value="group.subtotal" />
          </div>
          <OfficialShippingCard
            :is-pre-order="group.activityIsPreOrder"
            :start-time="group.officialShippingStartTime"
            :end-time="group.officialShippingEndTime"
            variant="compact"
          />
          <CartItem v-for="item in group.items" :key="item.id" :item="item" />
        </section>
      </div>
      <CartSummary @submit="goCheckout" />
    </div>

    <AppEmpty v-else icon="bag" :message="t('cart.empty')">
      <RouterLink class="app-button app-button--dark" :to="{ name: ROUTE_NAMES.ACTIVITY_LIST }">
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
import OfficialShippingCard from '@/shared/components/OfficialShippingCard.vue';
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
