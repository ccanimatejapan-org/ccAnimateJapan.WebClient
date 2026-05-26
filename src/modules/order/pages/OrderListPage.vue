<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('order.eyebrow') }}</p>
        <h1>{{ t('order.title') }}</h1>
      </div>
    </div>

    <div class="order-list">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import OrderCard from '../components/OrderCard.vue';
import { getOrders } from '../api/orderApi';

const { t } = useI18n();
const orders = ref([]);

onMounted(async () => {
  orders.value = await getOrders();
});
</script>

<style scoped lang="scss">
@use '../styles/order-list';
</style>
