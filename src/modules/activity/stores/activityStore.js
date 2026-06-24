import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getActivities, getActivity, getPopularActivities, getWorks } from '../api/activityApi';

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

  // 作品頁 drill-down：分頁取某作品底下的活動，回傳結果（不覆蓋首頁 activities）。
  async function fetchActivitiesByWorkPaged(animateTypeId, page, pageSize) {
    const data = await getActivities({ animateTypeId, page, pageSize });
    return {
      items: normalizeActivities(data?.items),
      total: Math.max(0, Number(data?.totalCount) || 0)
    };
  }

  async function getOrFetchActivity(activityId) {
    const id = Number(activityId);
    if (!Number.isFinite(id) || id <= 0) return null;

    const cached = activities.value.find((item) => Number(item.id) === id);
    if (cached) return cached;

    try {
      return (await getActivity(id)) || null;
    } catch {
      return null;
    }
  }

  function reset() {
    activities.value = [];
    isLoaded.value = false;
    isLoading.value = false;
    error.value = null;
    popularActivities.value = [];
    works.value = [];
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
    fetchActivitiesByWorkPaged,
    getOrFetchActivity,
    reset
  };
});
