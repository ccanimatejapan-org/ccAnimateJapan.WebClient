<template>
  <section id="activities" class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('home.featuredEyebrow') }}</p>
        <h2>{{ t('home.featuredTitle') }}</h2>
      </div>
    </div>

    <AppLoading v-if="activityStore.isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="activityStore.error" :message="t('activity.loadFailed')" />
    <AppEmpty
      v-else-if="activityStore.activities.length === 0"
      :message="t('activity.empty')"
    />
    <div v-else class="activity-grid">
      <ActivityCard
        v-for="activity in activityStore.activities"
        :key="activity.id"
        :activity="activity"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import ActivityCard from './ActivityCard.vue';

const { t } = useI18n();
const activityStore = useActivityStore();

onMounted(() => {
  if (!activityStore.isLoaded) {
    activityStore.fetchActivities();
  }
});
</script>

<style scoped lang="scss">
@use '../styles/activity-section';
</style>
