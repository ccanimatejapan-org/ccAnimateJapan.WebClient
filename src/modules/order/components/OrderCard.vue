<template>
  <article class="order-card">
    <div class="order-card__main">
      <p>{{ order.orderNo || `#${order.id}` }}</p>
      <h3>{{ order.activityName }}</h3>
      <span>{{ formatDateTime(order.createdAt) }}</span>
    </div>
    <div class="order-card__total">
      <span>{{ t('order.total') }}</span>
      <AppPrice :value="order.total" />
    </div>
    <RouterLink
      class="app-button app-button--secondary order-card__detail"
      :to="{ name: ROUTE_NAMES.ORDER_DETAIL, params: { id: order.id } }"
    >
      {{ t('order.detail') }}
    </RouterLink>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppPrice from '@/shared/components/AppPrice.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { formatDateTime } from '@/shared/utils/date';

defineProps({
  order: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/order-card';
</style>
