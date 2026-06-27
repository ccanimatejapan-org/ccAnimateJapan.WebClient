<template>
  <div class="activity-list">
    <header class="activity-list__head">
      <h1 class="activity-list__title">{{ t('activity.listTitle') }}</h1>
      <div class="activity-list__filters">
        <HomeCategoryChips v-model="availability" />
        <div class="activity-list__search" :class="{ 'activity-list__search--open': searchOpen }">
          <button
            v-if="!searchOpen"
            type="button"
            class="activity-list__search-toggle"
            :aria-label="t('activity.searchLabel')"
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
            class="activity-list__search-input"
            :placeholder="t('activity.searchPlaceholder')"
            :aria-label="t('activity.searchLabel')"
            @blur="onSearchBlur"
          />
        </div>
      </div>
    </header>

    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="loadFailed" :message="t('activity.loadFailed')" />
    <AppEmpty v-else-if="!activities.length" :message="t('activity.empty')" />
    <div v-else class="activity-list__grid">
      <template v-for="item in displayItems" :key="item._divider ? 'ended-divider' : item.id">
        <div v-if="item._divider" class="activity-list__divider" role="separator">
          {{ t('activity.endedDivider') }}
        </div>
        <HomeActivityCard v-else :activity="item" variant="compact" />
      </template>
    </div>
    <AppPagination :page="page" :total-pages="totalPages" @update:page="goTo" />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import AppPagination from '@/shared/components/AppPagination.vue';
import { useServerPagination } from '@/shared/composables/useServerPagination';
import HomeActivityCard from '@/modules/home/components/HomeActivityCard.vue';
import HomeCategoryChips from '@/modules/home/components/HomeCategoryChips.vue';

const { t } = useI18n();
const activityStore = useActivityStore();
const availability = ref('all');
const searchInput = ref('');
const searchOpen = ref(false);
const searchField = ref(null);
const ACTIVITY_STATUS_ENDED = 4;

function openSearch() {
  searchOpen.value = true;
  nextTick(() => searchField.value?.focus());
}

// 失焦時若沒有輸入內容，收合回放大鏡。
function onSearchBlur() {
  if (!searchInput.value.trim()) {
    searchOpen.value = false;
  }
}

const {
  page,
  items: activities,
  isLoading,
  loadFailed,
  totalPages,
  load,
  goTo,
  reset
} = useServerPagination(
  (p, ps) => activityStore.fetchActivitiesPaged(p, ps, availability.value, searchInput.value),
  12
);

const displayItems = computed(() => {
  const items = [];
  let dividerInserted = false;

  for (const activity of activities.value ?? []) {
    if (!dividerInserted && activity?.status === ACTIVITY_STATUS_ENDED) {
      items.push({ _divider: true });
      dividerInserted = true;
    }

    items.push(activity);
  }

  return items;
});

watch(availability, () => {
  reset();
  load(1);
});

// 模糊搜尋輸入做 debounce，停止輸入後再回後端查詢（避免逐字打 API）。
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
@use '../styles/activity-list';
</style>
