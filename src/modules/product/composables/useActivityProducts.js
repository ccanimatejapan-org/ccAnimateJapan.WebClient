import { ref } from 'vue';

export function useActivityProducts(fetchProductsByActivity) {
  const products = ref([]);
  const isLoading = ref(false);
  const loadFailed = ref(false);
  let requestSeq = 0;

  async function load(activityId) {
    const currentSeq = ++requestSeq;
    isLoading.value = true;
    products.value = [];
    loadFailed.value = false;

    try {
      const nextProducts = await fetchProductsByActivity(activityId);
      if (currentSeq !== requestSeq) return;

      products.value = Array.isArray(nextProducts) ? nextProducts : [];
    } catch {
      if (currentSeq !== requestSeq) return;

      loadFailed.value = true;
      products.value = [];
    } finally {
      if (currentSeq === requestSeq) {
        isLoading.value = false;
      }
    }
  }

  function reset() {
    requestSeq += 1;
    products.value = [];
    isLoading.value = false;
    loadFailed.value = false;
  }

  return {
    products,
    isLoading,
    loadFailed,
    load,
    reset
  };
}
