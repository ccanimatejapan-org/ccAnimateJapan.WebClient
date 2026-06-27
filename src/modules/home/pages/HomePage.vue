<template>
  <div class="page-stack">
    <HomeBannerCarousel />
    <HomeAnimateTypeRow />
    <HomePopularActivities />
    <HomeOngoingActivities
      :activities="activityStore.latestActivities"
      :loading="activityStore.isLatestLoading"
    />
    <HomeEndingSoonActivities
      :activities="activityStore.endingSoonActivities"
      :loading="activityStore.isEndingSoonLoading"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import HomeBannerCarousel from '../components/HomeBannerCarousel.vue';
import HomeAnimateTypeRow from '../components/HomeAnimateTypeRow.vue';
import HomePopularActivities from '../components/HomePopularActivities.vue';
import HomeOngoingActivities from '../components/HomeOngoingActivities.vue';
import HomeEndingSoonActivities from '../components/HomeEndingSoonActivities.vue';

const activityStore = useActivityStore();

onMounted(() => {
  // 「最新活動」資料由後端套用「過去兩週到今天」時間區間後回傳。
  if (!activityStore.latestActivities.length) {
    activityStore.fetchLatestActivities();
  }
  // 「快結束活動」資料由後端套用「今天到一週後」時間區間後回傳。
  if (!activityStore.endingSoonActivities.length) {
    activityStore.fetchEndingSoonActivities();
  }
});
</script>

<style scoped lang="scss">
@use '../styles/home-page';
</style>
