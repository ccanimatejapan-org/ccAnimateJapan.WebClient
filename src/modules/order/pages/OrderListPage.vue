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
    <AppEmpty v-else-if="items.length === 0" :message="t('order.empty')" />
    <div v-else class="order-list">
      <OrderCard v-for="order in items" :key="order.id" :order="order" />
    </div>
    <AppPagination :page="page" :total-pages="totalPages" @update:page="goTo" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import AppPagination from '@/shared/components/AppPagination.vue';
import { useServerPagination } from '@/shared/composables/useServerPagination';
import OrderCard from '../components/OrderCard.vue';
import { getOrders } from '../api/orderApi';

const { t } = useI18n();
const {
  page,
  items,
  isLoading,
  loadFailed,
  totalPages,
  load,
  goTo
} = useServerPagination(
  (p, ps) => getOrders({ page: p, pageSize: ps }).then((data) => ({
    items: data.items,
    total: data.totalCount
  })),
  10
);

onMounted(() => load(1));
</script>

<style scoped lang="scss">
@use '../styles/order-list';
</style>
