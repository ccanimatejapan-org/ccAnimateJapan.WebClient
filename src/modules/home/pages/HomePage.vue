<template>
  <div class="page-stack">
    <HomeCategoryChips v-model="availability" />
    <HomeBannerCarousel />
    <HomePopularActivities />
    <HomeAnimateTypeRow />
    <HomeOngoingActivities
      :activities="filteredActivities"
      :loading="activityStore.isLoading"
    />
    <HomeGuideSection />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { filterByAvailability } from '../utils/activityFilters';
import HomeCategoryChips from '../components/HomeCategoryChips.vue';
import HomeBannerCarousel from '../components/HomeBannerCarousel.vue';
import HomePopularActivities from '../components/HomePopularActivities.vue';
import HomeAnimateTypeRow from '../components/HomeAnimateTypeRow.vue';
import HomeOngoingActivities from '../components/HomeOngoingActivities.vue';
import HomeGuideSection from '../components/HomeGuideSection.vue';

const activityStore = useActivityStore();
const availability = ref('all');

const filteredActivities = computed(() =>
  filterByAvailability(activityStore.activities, availability.value)
);

onMounted(() => {
  if (!activityStore.isLoaded) {
    activityStore.fetchActivities();
  }
});
</script>

<style scoped lang="scss">
@use '../styles/home-page';
</style>
