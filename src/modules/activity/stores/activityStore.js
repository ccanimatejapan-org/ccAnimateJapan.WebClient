import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getActivities } from '../api/activityApi';

function normalizeActivities(value) {
  if (!Array.isArray(value)) return [];

  return value.filter((activity) => activity?.id != null);
}

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([]);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  const featuredActivities = computed(() => activities.value.slice(0, 3));

  async function fetchActivities(params = {}) {
    if (isLoading.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      activities.value = normalizeActivities(await getActivities(params));
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
