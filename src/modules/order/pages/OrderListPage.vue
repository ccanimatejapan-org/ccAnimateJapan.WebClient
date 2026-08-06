<template>
  <section class="section">
    <div class="section__header">
      <div class="order-list__heading">
        <p class="eyebrow">{{ t('order.eyebrow') }}</p>
        <div class="order-list__title-row">
          <h1>{{ t('order.title') }}</h1>
          <div class="order-list__search" :class="{ 'order-list__search--open': searchOpen }">
            <button
              v-if="!searchOpen"
              type="button"
              class="order-list__search-toggle"
              :aria-label="t('order.searchLabel')"
              @click="openSearch"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <input
              v-else
              ref="searchField"
              v-model="searchInput"
              type="search"
              class="order-list__search-input"
              :placeholder="t('order.searchPlaceholder')"
              :aria-label="t('order.searchLabel')"
              @blur="onSearchBlur"
            />
          </div>
        </div>
      </div>
      <OrderStageTabs v-model="orderStage" class="order-list__tabs" />
    </div>

    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="loadFailed" :message="t('order.loadFailed')" />
    <AppEmpty v-else-if="items.length === 0" :message="t('order.empty')" />
    <div v-else class="order-list">
      <OrderCard v-for="order in items" :key="order.id" :order="order" />
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import OrderCard from '../components/OrderCard.vue';
import OrderStageTabs from '../components/OrderStageTabs.vue';
import {
  buildOrderListQuery,
  DEFAULT_ORDER_STAGE
} from '../utils/orderStages';
import { getOrders } from '../api/orderApi';

const { t } = useI18n();
const searchInput = ref('');
const searchOpen = ref(false);
const searchField = ref(null);
const orderStage = ref(DEFAULT_ORDER_STAGE);
const items = ref([]);
const isLoading = ref(false);
const loadFailed = ref(false);

let requestId = 0;
let searchTimer = null;

function openSearch() {
  searchOpen.value = true;
  nextTick(() => searchField.value?.focus());
}

function onSearchBlur() {
  if (!searchInput.value.trim()) {
    searchOpen.value = false;
  }
}

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
