<template>
  <RouterLink class="order-card" :to="{ name: ROUTE_NAMES.ORDER_DETAIL, params: { id: order.id } }">
    <div>
      <p>{{ order.orderNo }}</p>
      <span>{{ formatDate(order.createdAt) }}</span>
    </div>
    <OrderStatusBadge :status="order.status" />
    <AppPrice :value="order.total" />
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppPrice from '@/shared/components/AppPrice.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { formatDate } from '@/shared/utils/date';
import OrderStatusBadge from './OrderStatusBadge.vue';

defineProps({
  order: {
    type: Object,
    required: true
  }
});
</script>

<style scoped lang="scss">
@use '../styles/order-card';
</style>
