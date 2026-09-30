<template>
  <div class="work-activities section">
    <header class="page-head">
      <RouterLink class="text-link work-activities__back" :to="{ name: ROUTE_NAMES.WORK_LIST }">
        <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        {{ t('work.backToList') }}
      </RouterLink>
      <p class="eyebrow">{{ t('work.workEyebrow') }}</p>
      <h1>{{ workName }}</h1>
      <p class="page-head__desc">{{ t('work.workSubtitle') }}</p>
    </header>

    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="loadFailed" icon="info" :message="t('activity.loadFailed')" />
    <AppEmpty v-else-if="!activities.length" :message="t('work.activitiesEmpty')" />
    <div v-else class="card-grid">
      <HomeActivityCard
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        variant="compact"
      />
    </div>
    <AppPagination :page="page" :total-pages="totalPages" @update:page="goTo" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import AppPagination from '@/shared/components/AppPagination.vue';
import { useServerPagination } from '@/shared/composables/useServerPagination';
import HomeActivityCard from '@/modules/home/components/HomeActivityCard.vue';

const props = defineProps({
  animateTypeId: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const activityStore = useActivityStore();
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
  (p, ps) => activityStore.fetchActivitiesByWorkPaged(props.animateTypeId, p, ps),
  12
);

// 作品名取自第一筆活動（後端活動已帶 animateTypeName）。
const workName = computed(() => activities.value[0]?.animateTypeName || t('work.notFound'));

onMounted(() => load(1));
watch(() => props.animateTypeId, () => {
  reset();
  load(1);
});
</script>

<style scoped lang="scss">
@use '../styles/work-activities';
</style>
