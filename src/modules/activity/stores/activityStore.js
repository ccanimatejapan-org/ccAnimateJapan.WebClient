import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getActivities, getPopularActivities, getWorks } from '../api/activityApi';

function normalizeActivities(value) {
  if (!Array.isArray(value)) return [];

  return value.filter((activity) => activity?.id != null);
}

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([]);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  // 人氣活動與作品改由專屬 API 取得（後端 /activities/popular、/works）。
  const popularActivities = ref([]);
  const works = ref([]);

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

  async function fetchPopularActivities(limit = 5) {
    try {
      popularActivities.value = normalizeActivities(await getPopularActivities(limit));
    } catch (err) {
      error.value = err;
      popularActivities.value = [];
    }
  }

  async function fetchWorks(limit) {
    try {
      const list = await getWorks(limit);
      // 後端回 { id, name, activityCount }；對應前端模板使用的 { id, name, count }。
      works.value = Array.isArray(list)
        ? list
            .filter((work) => work?.id != null)
            .map((work) => ({ id: work.id, name: work.name, count: work.activityCount ?? 0 }))
        : [];
    } catch (err) {
      error.value = err;
      works.value = [];
    }
  }

  // 作品頁 drill-down：取某作品底下的活動，回傳結果（不覆蓋首頁 activities）。
  async function fetchActivitiesByWork(animateTypeId) {
    return normalizeActivities(await getActivities({ animateTypeId }));
  }

  return {
    activities,
    isLoaded,
    isLoading,
    error,
    popularActivities,
    works,
    fetchActivities,
    fetchPopularActivities,
    fetchWorks,
    fetchActivitiesByWork
  };
});
