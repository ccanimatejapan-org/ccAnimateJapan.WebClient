<template>
  <article class="order-card">
    <div class="order-card__main">
      <div class="order-card__heading">
        <p>{{ order.orderNo || `#${order.id}` }}</p>
        <OrderStatusBadge :order-status="order.orderStatus" />
      </div>
      <h3>{{ order.activityName }}</h3>
      <span>{{ formatDateTime(order.createdAt) }}</span>
    </div>
    <div class="order-card__total">
      <span>{{ t('order.total') }}</span>
      <AppPrice :value="order.grandTotal" />
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
import OrderStatusBadge from './OrderStatusBadge.vue';

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
