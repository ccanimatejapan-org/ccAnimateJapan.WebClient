import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getActivities,
  getActivity,
  getPopularActivities,
  getLatestActivities,
  getEndingSoonActivities,
  getWorks
} from '../api/activityApi';

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

  // 最新活動：後端已套用「過去兩週到今天」的時間區間（/activities/latest），前端只負責顯示。
  const latestActivities = ref([]);
  const isLatestLoading = ref(false);

  // 快結束活動：後端已套用「今天到一週後」的時間區間（/activities/ending-soon），前端只負責顯示。
  const endingSoonActivities = ref([]);
  const isEndingSoonLoading = ref(false);

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

  async function fetchLatestActivities(limit = 6) {
    isLatestLoading.value = true;
    try {
      latestActivities.value = normalizeActivities(await getLatestActivities(limit));
    } catch (err) {
      error.value = err;
      latestActivities.value = [];
    } finally {
      isLatestLoading.value = false;
    }
  }

  async function fetchEndingSoonActivities(limit = 6) {
    isEndingSoonLoading.value = true;
    try {
      endingSoonActivities.value = normalizeActivities(await getEndingSoonActivities(limit));
    } catch (err) {
      error.value = err;
      endingSoonActivities.value = [];
    } finally {
      isEndingSoonLoading.value = false;
    }
  }

  async function fetchWorks(limit) {
    try {
      const list = await getWorks(limit);
      // 後端回 { id, name, imageUrl, activityCount }；對應前端模板使用的 { id, name, imageUrl, count }。
      works.value = Array.isArray(list)
        ? list
            .filter((work) => work?.id != null)
            .map((work) => ({
              id: work.id,
              name: work.name,
              imageUrl: work.imageUrl || '',
              count: work.activityCount ?? 0
            }))
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

  async function fetchActivitiesPaged(page, pageSize, availability = 'all', search = '') {
    const params = { page, pageSize };
    if (availability === 'preOrder') params.isPreOrder = true;
    else if (availability === 'inStock') params.isPreOrder = false;

    const keyword = typeof search === 'string' ? search.trim() : '';
    if (keyword) params.search = keyword;

    const data = await getActivities(params);
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
    latestActivities.value = [];
    isLatestLoading.value = false;
    endingSoonActivities.value = [];
    isEndingSoonLoading.value = false;
  }

  return {
    activities,
    isLoaded,
    isLoading,
    error,
    popularActivities,
    works,
    latestActivities,
    isLatestLoading,
    endingSoonActivities,
    isEndingSoonLoading,
    fetchActivities,
    fetchPopularActivities,
    fetchLatestActivities,
    fetchEndingSoonActivities,
    fetchWorks,
    fetchActivitiesByWorkPaged,
    fetchActivitiesPaged,
    getOrFetchActivity,
    reset
  };
});
