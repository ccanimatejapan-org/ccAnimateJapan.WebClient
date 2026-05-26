<template>
  <section class="section narrow-section complete-panel">
    <p class="eyebrow">{{ t('checkout.completeEyebrow') }}</p>
    <h1>{{ t('checkout.completeTitle') }}</h1>
    <p>{{ t('checkout.completeMessage') }}</p>
    <RouterLink class="app-button app-button--primary" :to="{ name: ROUTE_NAMES.ORDER_LIST }">
      {{ t('checkout.viewOrders') }}
    </RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/checkout-complete';
</style>
