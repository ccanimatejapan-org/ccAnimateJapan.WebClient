<template>
  <section v-if="order" class="section narrow-section">
    <p class="eyebrow">{{ t('order.detail') }}</p>
    <h1>{{ order.orderNo }}</h1>
    <OrderStatusBadge :status="order.status" />
    <div class="summary-row">
      <span>{{ t('order.createdAt') }}</span>
      <span>{{ formatDate(order.createdAt) }}</span>
    </div>
    <div class="summary-row">
      <span>{{ t('order.total') }}</span>
      <AppPrice :value="order.total" />
    </div>
  </section>
  <AppEmpty v-else :message="t('order.notFound')" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { formatDate } from '@/shared/utils/date';
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
