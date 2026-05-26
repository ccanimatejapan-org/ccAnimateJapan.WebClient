<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="site-header__brand" :to="{ name: ROUTE_NAMES.HOME }">
        ccAnimateJapan
      </RouterLink>
      <nav class="site-header__nav" aria-label="Main">
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">
          {{ t('nav.products') }}
        </RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.ORDER_LIST }">
          {{ t('nav.orders') }}
        </RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.MEMBER_PROFILE }">
          {{ t('nav.member') }}
        </RouterLink>
      </nav>
      <RouterLink class="site-header__cart" :to="{ name: ROUTE_NAMES.CART }">
        {{ t('nav.cart') }} ({{ cart.totalQuantity }})
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
import { RouterLink, RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '@/modules/cart/stores/cartStore';

const { t } = useI18n();
const cart = useCartStore();
</script>

<style scoped lang="scss">
@use './styles/default-layout';
</style>
