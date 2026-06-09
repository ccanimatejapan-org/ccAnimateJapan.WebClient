<template>
  <div class="work-activities">
    <header class="work-activities__head">
      <RouterLink class="work-activities__back" :to="{ name: ROUTE_NAMES.WORK_LIST }">
        ‹ {{ t('work.listTitle') }}
      </RouterLink>
      <h1 class="work-activities__title">{{ workName }}</h1>
    </header>

    <AppLoading v-if="activityStore.isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="!activities.length" :message="t('work.activitiesEmpty')" />
    <div v-else class="work-activities__grid">
      <HomeActivityCard
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        variant="compact"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import HomeActivityCard from '@/modules/home/components/HomeActivityCard.vue';

const props = defineProps({
  animateTypeId: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const activityStore = useActivityStore();

const activities = computed(() => activityStore.activitiesByAnimateType(props.animateTypeId));

const workName = computed(() => {
  const id = Number(props.animateTypeId);
  const match = activityStore.animateTypes.find((work) => work.id === id);
  return match?.name || t('work.notFound');
});

onMounted(() => {
  if (!activityStore.isLoaded) {
    activityStore.fetchActivities();
  }
});
</script>

<style scoped lang="scss">
@use '../styles/work-activities';
</style>
