import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getActivities } from '../api/activityApi';

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([]);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  const featuredActivities = computed(() => activities.value.slice(0, 3));

  async function fetchActivities() {
    if (isLoading.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      activities.value = await getActivities({ limit: 3 });
      isLoaded.value = true;
    } catch (err) {
      error.value = err;
      activities.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    activities,
    isLoaded,
    isLoading,
    error,
    featuredActivities,
    fetchActivities
  };
});
