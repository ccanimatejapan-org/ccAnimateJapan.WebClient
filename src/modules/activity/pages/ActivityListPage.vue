<template>
  <div class="activity-list section">
    <header class="page-head">
      <p class="eyebrow">{{ t('activity.eyebrow') }}</p>
      <h1>{{ t('activity.listTitle') }}</h1>
      <p class="page-head__desc">{{ t('activity.listSubtitle') }}</p>
    </header>

    <div class="activity-list__filters">
      <label class="search-field">
        <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0" /></svg>
        <input
          v-model="searchInput"
          type="search"
          enterkeyhint="search"
          :placeholder="t('activity.searchPlaceholder')"
          :aria-label="t('activity.searchLabel')"
        />
      </label>
      <HomeCategoryChips v-model="availability" />
      <div class="activity-list__meta">
        <RouterLink class="text-link" :to="{ name: ROUTE_NAMES.WORK_LIST }">
          {{ t('activity.browseByWork') }}
          <svg class="ui-icon activity-list__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
        </RouterLink>
      </div>
    </div>

    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="loadFailed" icon="info" :message="t('activity.loadFailed')">
      <button type="button" class="app-button app-button--dark" @click="load(page)">{{ t('common.retry') }}</button>
    </AppEmpty>
    <AppEmpty v-else-if="!activities.length" icon="search" :message="t('activity.empty')">
      <button v-if="searchInput.trim()" type="button" class="app-button app-button--dark" @click="searchInput = ''">
        {{ t('common.clearSearch') }}
      </button>
    </AppEmpty>
    <div v-else class="card-grid">
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import AppPagination from '@/shared/components/AppPagination.vue';
import { useServerPagination } from '@/shared/composables/useServerPagination';
import HomeActivityCard from '@/modules/home/components/HomeActivityCard.vue';
import HomeCategoryChips from '@/modules/home/components/HomeCategoryChips.vue';

const { t } = useI18n();
const activityStore = useActivityStore();
const route = useRoute();
const AVAILABILITY_VALUES = ['all', 'preOrder', 'inStock'];
const availability = ref(AVAILABILITY_VALUES.includes(route.query.availability) ? route.query.availability : 'all');
const searchInput = ref(typeof route.query.q === 'string' ? route.query.q : '');
const ACTIVITY_STATUS_ENDED = 4;

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
