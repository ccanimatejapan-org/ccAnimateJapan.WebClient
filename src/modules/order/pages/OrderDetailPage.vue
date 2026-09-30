<template>
  <AppLoading v-if="isLoading" :label="t('common.loading')" />
  <section v-else-if="order" class="section order-detail">
    <header class="page-head">
      <p class="eyebrow">{{ t('order.detailEyebrow') }}</p>
      <div class="order-detail__heading">
        <h1>{{ order.activityName }}</h1>
        <OrderStatusBadge :order-status="order.orderStatus" />
      </div>
      <p class="page-head__desc order-detail__meta">
        {{ t('order.orderNoLabel') }}{{ order.orderNo || `#${order.id}` }}
        <span aria-hidden="true">·</span>
        {{ t('order.createdAt') }} {{ formatDateTime(order.createdAt) }}
      </p>
    </header>

    <div class="order-detail__grid">
      <div class="order-detail__stack">
        <OfficialShippingCard
          :is-pre-order="order.activityIsPreOrder"
          :start-time="order.officialShippingStartTime"
          :end-time="order.officialShippingEndTime"
          variant="full"
        />

        <section class="panel">
          <h2 class="panel__title">{{ t('order.section.items') }}</h2>
          <div class="order-detail__items">
            <article v-for="item in order.items" :key="item.productId" class="order-detail__item">
              <div>
                <h3>{{ item.productName }}</h3>
                <p v-if="item.note">{{ item.note }}</p>
                <span class="order-detail__qty">x {{ item.quantity }}</span>
              </div>
              <AppPrice :value="item.price * item.quantity" />
            </article>
          </div>
          <div v-if="order.shippingFee > 0" class="summary-row">
            <span>{{ t('order.shippingFeeAmountLabel') }}</span>
            <AppPrice :value="order.shippingFee" />
          </div>
          <div class="summary-row order-detail__total">
            <span>{{ t('order.total') }}</span>
            <AppPrice :value="order.grandTotal" />
          </div>
        </section>
      </div>

      <div class="order-detail__stack">
        <section class="panel">
          <h2 class="panel__title">{{ t('order.section.status') }}</h2>
          <div class="order-detail__row">
            <span>{{ t('order.processStatusLabel') }}</span>
            <OrderStatusBadge :order-status="order.orderStatus" />
          </div>
          <div class="order-detail__row">
            <span>{{ t('order.paymentStatusLabel') }}</span>
            <StatusBadge
              :variant="order.paymentStatus === 'paid' ? 'paid' : 'pending'"
              :label="t(paymentStatusLabelKey)"
            />
          </div>
          <div class="order-detail__row">
            <span>{{ t('order.shippingFeeLabel') }}</span>
            <span class="order-detail__value">
              {{ requiresJapanShipping ? t('order.shippingRequired') : t('order.shippingNotRequired') }}
            </span>
          </div>
          <div class="order-detail__row">
            <span>{{ t('order.shippingPaymentStatusLabel') }}</span>
            <StatusBadge
              v-if="requiresJapanShipping"
              :variant="shippingPaymentStatus.variant"
              :label="t(shippingPaymentStatus.labelKey)"
            />
            <StatusBadge v-else variant="neutral" :label="t('order.shippingPaymentStatus.none')" />
          </div>
        </section>

        <section class="panel">
          <h2 class="panel__title">{{ t('order.section.shipping') }}</h2>
          <div v-if="order.deliveryTypeName" class="order-detail__row">
            <span>{{ t('order.deliveryMethod') }}</span>
            <span class="order-detail__value">{{ order.deliveryTypeName }}</span>
          </div>
          <div v-if="order.address" class="order-detail__row">
            <span>{{ t('order.recipientAddress') }}</span>
            <span class="order-detail__value">{{ order.address }}</span>
          </div>
          <div v-if="order.recipientPhone" class="order-detail__row">
            <span>{{ t('order.recipientPhone') }}</span>
            <span class="order-detail__value">{{ order.recipientPhone }}</span>
          </div>
          <p v-if="!order.deliveryTypeName && !order.address && !order.recipientPhone" class="order-detail__empty-hint">
            {{ t('order.noShippingInfo') }}
          </p>
        </section>

        <RouterLink class="app-button app-button--secondary" :to="{ name: ROUTE_NAMES.ORDER_LIST }">
          {{ t('order.backToList') }}
        </RouterLink>
      </div>
    </div>
  </section>
  <AppEmpty v-else icon="box" :message="t(loadFailed ? 'order.loadFailed' : 'order.notFound')">
    <RouterLink class="app-button app-button--dark" :to="{ name: ROUTE_NAMES.ORDER_LIST }">
      {{ t('order.backToList') }}
    </RouterLink>
  </AppEmpty>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { ROUTE_NAMES } from '@/shared/constants/routes';
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

// 是否需補日本境內運：依後端 shippingFee 判斷，不由付款狀態推算。
const requiresJapanShipping = computed(() => Number(order.value?.shippingFee) > 0);

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
@use '../styles/order-detail';
</style>
