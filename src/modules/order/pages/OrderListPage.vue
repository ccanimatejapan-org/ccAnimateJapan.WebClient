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
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import AppPagination from '@/shared/components/AppPagination.vue';
import { useServerPagination } from '@/shared/composables/useServerPagination';
import OrderCard from '../components/OrderCard.vue';
import { getOrders } from '../api/orderApi';

const { t } = useI18n();
const searchInput = ref('');
const searchOpen = ref(false);
const searchField = ref(null);

function openSearch() {
  searchOpen.value = true;
  nextTick(() => searchField.value?.focus());
}

function onSearchBlur() {
  if (!searchInput.value.trim()) {
    searchOpen.value = false;
  }
}

const {
  page,
  items,
  isLoading,
  loadFailed,
  totalPages,
  load,
  goTo,
  reset
} = useServerPagination(
  (p, ps) => {
    const params = { page: p, pageSize: ps };
    const keyword = searchInput.value.trim();
    if (keyword) params.search = keyword;
    return getOrders(params).then((data) => ({ items: data.items, total: data.totalCount }));
  },
  10
);

let searchTimer = null;
watch(searchInput, () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    reset();
    load(1);
  }, 350);
});

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer);
});

onMounted(() => load(1));
</script>

<style scoped lang="scss">
@use '../styles/order-list';
</style>
