<template>
  <div class="checkout-shell">
    <header class="checkout-header">
      <RouterLink class="site-header__brand" :to="{ name: ROUTE_NAMES.HOME }">
        ccAnimateJapan
      </RouterLink>
      <RouterLink :to="{ name: ROUTE_NAMES.CART }">{{ t('nav.cart') }}</RouterLink>
    </header>

    <main class="checkout-main">
      <CheckoutSteps />
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
import CheckoutSteps from '@/modules/checkout/components/CheckoutSteps.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use './styles/checkout-layout';
</style>
