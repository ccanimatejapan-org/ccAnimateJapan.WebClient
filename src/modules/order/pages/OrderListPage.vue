<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('order.eyebrow') }}</p>
        <h1>{{ t('order.title') }}</h1>
      </div>
    </div>

    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="loadFailed" :message="t('order.loadFailed')" />
    <AppEmpty v-else-if="orders.length === 0" :message="t('order.empty')" />
    <div v-else class="order-list">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import OrderCard from '../components/OrderCard.vue';
import { getOrders } from '../api/orderApi';

const { t } = useI18n();
const orders = ref([]);
const isLoading = ref(true);
const loadFailed = ref(false);

onMounted(async () => {
  try {
    orders.value = await getOrders();
  } catch {
    loadFailed.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
@use '../styles/order-list';
</style>
