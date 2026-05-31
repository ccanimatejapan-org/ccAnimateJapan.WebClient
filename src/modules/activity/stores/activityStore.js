import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getActivities, getActivityById } from '../api/activityApi';

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([]);
  const activityDetails = ref({});
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  const featuredActivities = computed(() => activities.value.slice(0, 3));

  function findActivity(activityId) {
    const id = Number(activityId);
    return activities.value.find((activity) => activity.id === id) || activityDetails.value[id] || null;
  }

  async function fetchActivities(params = {}) {
    if (isLoading.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      activities.value = await getActivities(params);
      isLoaded.value = true;
    } catch (err) {
      error.value = err;
      activities.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchActivity(activityId) {
    const cached = findActivity(activityId);
    if (cached) return cached;

    const activity = await getActivityById(activityId);
    if (activity) {
      activityDetails.value = {
        ...activityDetails.value,
        [activity.id]: activity
      };
    }
    return activity;
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
