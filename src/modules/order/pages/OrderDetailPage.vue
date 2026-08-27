<template>
  <AppLoading v-if="isLoading" :label="t('common.loading')" />
  <section v-else-if="order" class="section narrow-section">
    <p class="eyebrow">{{ t('order.detail') }}</p>
    <div class="order-detail__heading">
      <h1>{{ t('order.orderNoLabel') }}{{ order.orderNo || `#${order.id}` }}</h1>
      <OrderStatusBadge :order-status="order.orderStatus" />
    </div>
    <p class="order-detail__activity">{{ order.activityName }}</p>
    <p class="order-detail__created">{{ t('order.createdAt') }} · {{ formatDateTime(order.createdAt) }}</p>

    <OfficialShippingCard
      class="order-detail__shipping"
      :is-pre-order="order.activityIsPreOrder"
      :start-time="order.officialShippingStartTime"
      :end-time="order.officialShippingEndTime"
      variant="full"
    />
    <div class="order-detail__sections">
      <section class="order-detail__block">
        <h2 class="order-detail__block-title">{{ t('order.section.items') }}</h2>
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
        <div v-if="order.shippingFee > 0" class="summary-row">
          <span>{{ t('order.shippingFeeLabel') }}</span>
          <AppPrice :value="order.shippingFee" />
        </div>
        <div class="summary-row order-detail__total">
          <span>{{ t('order.total') }}</span>
          <AppPrice :value="order.grandTotal" />
        </div>
      </section>

      <section class="order-detail__block">
        <h2 class="order-detail__block-title">{{ t('order.section.status') }}</h2>
        <div class="summary-row">
          <span>{{ t('order.processStatusLabel') }}</span>
          <OrderStatusBadge :order-status="order.orderStatus" />
        </div>
        <div class="summary-row">
          <span>{{ t('order.paymentStatusLabel') }}</span>
          <StatusBadge
            :variant="order.paymentStatus === 'paid' ? 'paid' : 'pending'"
            :label="t(paymentStatusLabelKey)"
          />
        </div>
        <div v-if="order.shippingFee > 0" class="summary-row">
          <span>{{ t('order.shippingPaymentStatusLabel') }}</span>
          <StatusBadge
            :variant="shippingPaymentStatus.variant"
            :label="t(shippingPaymentStatus.labelKey)"
          />
        </div>
      </section>

      <section class="order-detail__block">
        <h2 class="order-detail__block-title">{{ t('order.section.shipping') }}</h2>
        <div v-if="order.deliveryTypeName" class="summary-row">
          <span>{{ t('order.deliveryMethod') }}</span>
          <span>{{ order.deliveryTypeName }}</span>
        </div>
        <div v-if="order.address" class="summary-row">
          <span>{{ t('order.recipientAddress') }}</span>
          <span>{{ order.address }}</span>
        </div>
        <div v-if="order.recipientPhone" class="summary-row">
          <span>{{ t('order.recipientPhone') }}</span>
          <span>{{ order.recipientPhone }}</span>
        </div>
        <p v-if="!order.deliveryTypeName && !order.address && !order.recipientPhone" class="order-detail__empty-hint">
          {{ t('order.noShippingInfo') }}
        </p>
      </section>
    </div>
  </section>
  <AppEmpty v-else :message="t(loadFailed ? 'order.loadFailed' : 'order.notFound')" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import OfficialShippingCard from '@/shared/components/OfficialShippingCard.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { formatDateTime } from '@/shared/utils/date';
import { mapShippingPaymentStatus } from '../utils/shippingPaymentStatus';
import OrderStatusBadge from '../components/OrderStatusBadge.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { getOrderById } from '../api/orderApi';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const order = ref(null);
const isLoading = ref(true);
const loadFailed = ref(false);

const paymentStatusLabelKey = computed(() =>
  order.value?.paymentStatus === 'paid'
    ? 'order.paymentStatus.paid'
    : 'order.paymentStatus.unpaid'
);

const shippingPaymentStatus = computed(() => mapShippingPaymentStatus(order.value?.shippingPaymentStatus));

onMounted(async () => {
  try {
    order.value = await getOrderById(props.id);
  } catch {
    loadFailed.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.order-detail__activity {
  margin: -12px 0 0;
  color: $color-muted;
}

.order-detail__created {
  margin: -6px 0 0;
  color: $color-muted;
  font-size: 0.85rem;
}

.order-detail__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.order-detail__heading h1 {
  min-width: 0;
  overflow-wrap: anywhere;
}

.order-detail__heading .status-badge {
  flex-shrink: 0;
}

.order-detail__shipping {
  margin: 12px 0 2px;
}

.order-detail__sections {
  display: grid;
  gap: 12px;
}

.order-detail__block {
  padding: 16px;
  border: 1px solid $color-border;
  border-radius: 8px;
  background: #fff;
}

.order-detail__block-title {
  margin: 0 0 12px;
  font-size: 1rem;
}

.order-detail__total {
  font-weight: 800;
}

.order-detail__empty-hint {
  margin: 0;
  color: $color-muted;
  font-size: 0.9rem;
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
