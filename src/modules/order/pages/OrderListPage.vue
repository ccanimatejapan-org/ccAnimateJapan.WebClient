<template>
  <section class="section order-list-page">
    <header class="page-head">
      <p class="eyebrow">{{ t('order.eyebrow') }}</p>
      <h1>{{ t('order.title') }}</h1>
      <p class="page-head__desc">{{ t('order.subtitle') }}</p>
    </header>
    <label class="search-field">
      <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0" /></svg>
      <input
        v-model="searchInput"
        type="search"
        :placeholder="t('order.searchPlaceholder')"
        :aria-label="t('order.searchLabel')"
      />
    </label>
    <OrderStageTabs v-model="orderStage" />
    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="loadFailed" icon="info" :message="t('order.loadFailed')">
      <button type="button" class="app-button app-button--dark" @click="loadOrders">{{ t('common.retry') }}</button>
    </AppEmpty>
    <AppEmpty v-else-if="items.length === 0" icon="box" :message="t('order.empty')" />
    <div v-else class="order-list">
      <OrderCard v-for="order in items" :key="order.id" :order="order" />
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import OrderCard from '../components/OrderCard.vue';
import OrderStageTabs from '../components/OrderStageTabs.vue';
import {
  buildOrderListQuery,
  DEFAULT_ORDER_STAGE,
  normalizeOrderStage
} from '../utils/orderStages';
import { getOrders } from '../api/orderApi';

const { t } = useI18n();
const route = useRoute();
const searchInput = ref('');
const orderStage = ref(normalizeOrderStage(route.query.stage) ?? DEFAULT_ORDER_STAGE);
const items = ref([]);
const isLoading = ref(false);
const loadFailed = ref(false);

let requestId = 0;
let searchTimer = null;

function normalizeItems(result) {
  if (Array.isArray(result)) {
    return result;
  }

  return result?.items ?? [];
}

async function loadOrders() {
  const currentRequestId = ++requestId;
  isLoading.value = true;
  loadFailed.value = false;

  try {
    const query = buildOrderListQuery({
      search: searchInput.value,
      orderStage: orderStage.value
    });
    const response = await getOrders(query);

    if (currentRequestId !== requestId) {
      return;
    }

    items.value = normalizeItems(response);
  } catch (error) {
    if (currentRequestId !== requestId) {
      return;
    }

    loadFailed.value = true;
    items.value = [];
    console.error(error);
  } finally {
    if (currentRequestId === requestId) {
      isLoading.value = false;
    }
  }
}

function scheduleSearch() {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  searchTimer = setTimeout(loadOrders, 350);
}

watch(orderStage, () => loadOrders());

watch(searchInput, scheduleSearch);

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
});

onMounted(() => {
  loadOrders();
});
</script>

<style scoped lang="scss">
@use '../styles/order-list';
</style>
