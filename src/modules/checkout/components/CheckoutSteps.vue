<template>
  <nav class="checkout-steps" aria-label="Checkout">
    <RouterLink
      v-for="step in steps"
      :key="step.name"
      :to="{ name: step.name }"
      :class="{ active: route.name === step.name }"
    >
      {{ t(step.labelKey) }}
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const route = useRoute();
const { t } = useI18n();
const steps = [
  { name: ROUTE_NAMES.CHECKOUT_INFO, labelKey: 'checkout.steps.info' },
  { name: ROUTE_NAMES.CHECKOUT_PAYMENT, labelKey: 'checkout.steps.payment' },
  { name: ROUTE_NAMES.CHECKOUT_COMPLETE, labelKey: 'checkout.steps.complete' }
];
</script>

<style scoped lang="scss">
@use '../styles/checkout-steps';
</style>
