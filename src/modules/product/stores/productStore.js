import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProductsByActivity } from '../api/productApi';
import { useActivityStore } from '@/modules/activity/stores/activityStore';

function normalizeProducts(value) {
  if (!Array.isArray(value)) return [];

  return value.filter((product) => product?.id != null);
}

export const useProductStore = defineStore('product', () => {
  const activity = ref(null);
  const activeActivityId = ref(null);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  async function getOrFetchActivity(activityId) {
    const normalizedActivityId = Number(activityId);
    if (!Number.isFinite(normalizedActivityId) || normalizedActivityId <= 0) {
      activeActivityId.value = null;
      activity.value = null;
      isLoaded.value = true;
      isLoading.value = false;
      error.value = null;
      return null;
    }

    if (activeActivityId.value === normalizedActivityId && isLoaded.value && activity.value) {
      return activity.value;
    }

    activeActivityId.value = normalizedActivityId;
    activity.value = null;
    isLoading.value = true;
    error.value = null;

    try {
      const activityStore = useActivityStore();
      const nextActivity = await activityStore.getOrFetchActivity(normalizedActivityId);

      if (activeActivityId.value !== normalizedActivityId) {
        return null;
      }

      activity.value = nextActivity?.id ? nextActivity : null;
      isLoaded.value = true;
      return activity.value;
    } catch (err) {
      if (activeActivityId.value !== normalizedActivityId) {
        return null;
      }
      error.value = err;
      activity.value = null;
      return null;
    } finally {
      if (activeActivityId.value === normalizedActivityId) {
        isLoading.value = false;
      }
    }
  }

  async function fetchProductsByActivityPaged(activityId, page, pageSize) {
    const data = await getProductsByActivity(activityId, { page, pageSize });
    return {
      items: normalizeProducts(data?.items),
      total: Math.max(0, Number(data?.totalCount) || 0)
    };
  }

  function reset() {
    activity.value = null;
    activeActivityId.value = null;
    isLoaded.value = false;
    isLoading.value = false;
    error.value = null;
  }

  return {
    activity,
    activeActivityId,
    isLoaded,
    isLoading,
    error,
    getOrFetchActivity,
    fetchProductsByActivityPaged,
    reset
  };
});
