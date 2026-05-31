<template>
  <RouterLink class="order-card" :to="{ name: ROUTE_NAMES.ORDER_DETAIL, params: { id: order.id } }">
    <div class="order-card__main">
      <p>{{ order.orderNo || `#${order.id}` }}</p>
      <h3>{{ order.activityName }}</h3>
      <span>{{ formatDateTime(order.createdAt) }}</span>
    </div>
    <div class="order-card__meta">
      <span>{{ t('order.paymentStatusLabel') }}</span>
      <strong>{{ t(paymentStatusLabelKey) }}</strong>
    </div>
    <div class="order-card__meta">
      <span>{{ t('order.processStatusLabel') }}</span>
      <OrderStatusBadge :order-status="order.orderStatus" />
    </div>
    <div class="order-card__total">
      <span>{{ t('order.total') }}</span>
      <AppPrice :value="order.total" />
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppPrice from '@/shared/components/AppPrice.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { formatDateTime } from '@/shared/utils/date';
import OrderStatusBadge from './OrderStatusBadge.vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();
const paymentStatusLabelKey = computed(() =>
  props.order.paymentStatus === 'paid'
    ? 'order.paymentStatus.paid'
    : 'order.paymentStatus.unpaid'
);
</script>

<style scoped lang="scss">
@use '../styles/order-card';
</style>
