<template>
  <section v-if="order" class="section narrow-section">
    <p class="eyebrow">{{ t('order.detail') }}</p>
    <h1>{{ order.orderNo || `#${order.id}` }}</h1>
    <p class="order-detail__activity">{{ order.activityName }}</p>
    <div class="order-detail__badges">
      <OrderStatusBadge :order-status="order.orderStatus" />
    </div>
    <div class="summary-row">
      <span>{{ t('order.createdAt') }}</span>
      <span>{{ formatDateTime(order.createdAt) }}</span>
    </div>
    <div class="summary-row">
      <span>{{ t('order.total') }}</span>
      <AppPrice :value="order.total" />
    </div>
    <div class="order-detail__items">
      <article v-for="item in order.items" :key="item.productId" class="order-detail__item">
        <div>
          <h3>{{ item.productName }}</h3>
          <p v-if="item.note">{{ item.note }}</p>
        </div>
        <span>x {{ item.quantity }}</span>
        <AppPrice :value="item.price * item.quantity" />
      </article>
    </div>
  </section>
  <AppEmpty v-else :message="t('order.notFound')" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { formatDateTime } from '@/shared/utils/date';
import OrderStatusBadge from '../components/OrderStatusBadge.vue';
import { getOrderById } from '../api/orderApi';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const order = ref(null);

onMounted(async () => {
  order.value = await getOrderById(props.id);
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.order-detail__activity {
  margin: -12px 0 0;
  color: $color-muted;
}

.order-detail__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.order-detail__items {
  display: grid;
  gap: 10px;
}

.order-detail__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid $color-border;
  border-radius: 8px;
  background: #fff;
}

.order-detail__item > div {
  min-width: 0;
}

.order-detail__item h3,
.order-detail__item p {
  margin: 0;
  overflow-wrap: anywhere;
}

.order-detail__item p {
  color: $color-muted;
  font-size: 0.9rem;
}

.order-detail__item > span,
.order-detail__item > .app-price {
  white-space: nowrap;
}

@media (max-width: 420px) {
  .order-detail__item {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }

  .order-detail__item > div {
    grid-column: 1 / -1;
  }

  .order-detail__item > span {
    grid-column: 1;
  }

  .order-detail__item > .app-price {
    grid-column: 2;
    justify-self: end;
  }
}
</style>
