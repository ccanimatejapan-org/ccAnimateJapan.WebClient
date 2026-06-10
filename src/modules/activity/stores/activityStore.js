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

  // 從已載入的活動 group 出「作品」清單（unique animateTypeId + 名稱 + 檔數）。
  // 沒有 animateTypeId 的活動（例如 real 模式尚未補欄位）會被忽略。
  const animateTypes = computed(() => {
    const map = new Map();

    for (const activity of activities.value) {
      const id = activity?.animateTypeId;
      if (id == null) continue;

      const existing = map.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(id, { id, name: activity.animateTypeName || '', count: 1 });
      }
    }

    return Array.from(map.values());
  });

  function activitiesByAnimateType(animateTypeId) {
    const id = Number(animateTypeId);
    if (!Number.isFinite(id)) return [];
    return activities.value.filter((activity) => Number(activity?.animateTypeId) === id);
  }

  // 人氣活動：依訂單數量由多到少取前 5 名。沒有 orderCount 的活動（例如 real 模式尚未補欄位）會被忽略。
  const popularActivities = computed(() =>
    activities.value
      .filter((activity) => Number(activity?.orderCount) > 0)
      .slice()
      .sort((a, b) => Number(b.orderCount) - Number(a.orderCount))
      .slice(0, 5)
  );

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
    animateTypes,
    activitiesByAnimateType,
    popularActivities,
    fetchActivities
  };
});
