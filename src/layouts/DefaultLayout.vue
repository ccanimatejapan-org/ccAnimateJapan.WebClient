<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="site-header__brand" :to="{ name: ROUTE_NAMES.HOME }">
        <span>ccAnimateJapan</span>
        <small>角色周邊小舖</small>
      </RouterLink>
      <nav class="site-header__nav" aria-label="Main">
        <RouterLink :to="{ name: ROUTE_NAMES.HOME, hash: '#activities' }">
          {{ t('nav.products') }}
        </RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.ORDER_LIST }">
          {{ t('nav.orders') }}
        </RouterLink>
      </nav>
      <RouterLink
        class="site-header__cart"
        :class="{ 'site-header__cart--bump': cartBumped }"
        :to="{ name: ROUTE_NAMES.CART }"
      >
        {{ t('nav.cart') }}
        <span>{{ cart.totalQuantity }}</span>
      </RouterLink>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <span>ccAnimateJapan</span>
      <span>{{ t('footer.copy') }}</span>
    </footer>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '@/modules/cart/stores/cartStore';

const { t } = useI18n();
const cart = useCartStore();
const cartBumped = ref(false);
let cartBumpFrame;
let cartBumpTimer;

watch(
  () => cart.totalQuantity,
  (quantity, previousQuantity) => {
    if (quantity <= previousQuantity) return;
    cartBumped.value = false;
    window.cancelAnimationFrame(cartBumpFrame);
    window.clearTimeout(cartBumpTimer);
    cartBumpFrame = window.requestAnimationFrame(() => {
      cartBumped.value = true;
      cartBumpTimer = window.setTimeout(() => {
        cartBumped.value = false;
      }, 420);
    });
  }
);

onBeforeUnmount(() => {
  window.cancelAnimationFrame(cartBumpFrame);
  window.clearTimeout(cartBumpTimer);
});
</script>

<style scoped lang="scss">
@use './styles/default-layout';
</style>
