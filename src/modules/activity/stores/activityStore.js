import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getActivities, getActivityById } from '../api/activityApi';

function normalizeActivities(value) {
  if (!Array.isArray(value)) return [];

  return value.filter((activity) => activity?.id != null);
}

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([]);
  const activityDetails = ref({});
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  const featuredActivities = computed(() => activities.value.slice(0, 3));

  function findActivity(activityId) {
    const id = Number(activityId);
    if (!Number.isFinite(id)) return null;
    return activities.value.find((activity) => activity?.id === id) || activityDetails.value[id] || null;
  }

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

  async function fetchActivity(activityId) {
    const id = Number(activityId);
    if (!Number.isFinite(id) || id <= 0) {
      error.value = null;
      return null;
    }

    const cached = findActivity(activityId);
    if (cached) return cached;

    try {
      const activity = await getActivityById(id);
      if (!activity?.id) return null;

      activityDetails.value = {
        ...activityDetails.value,
        [activity.id]: activity
      };
      return activity;
    } catch (err) {
      error.value = err;
      return null;
    }
  }

  return {
    activities,
    activityDetails,
    isLoaded,
    isLoading,
    error,
    featuredActivities,
    findActivity,
    fetchActivities,
    fetchActivity
  };
});
