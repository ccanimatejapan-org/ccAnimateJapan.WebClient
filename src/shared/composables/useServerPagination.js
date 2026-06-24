import { computed, ref } from 'vue';

export function useServerPagination(fetchPage, pageSize = 12) {
  const page = ref(1);
  const total = ref(0);
  const items = ref([]);
  const isLoading = ref(false);
  const loadFailed = ref(false);
  let seq = 0;

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));

  async function load(targetPage = page.value) {
    const requestSeq = ++seq;
    const nextPage = Math.max(1, Math.floor(Number(targetPage)) || 1);

    isLoading.value = true;
    loadFailed.value = false;

    try {
      const result = await fetchPage(nextPage, pageSize);
      if (requestSeq !== seq) return;

      items.value = Array.isArray(result?.items) ? result.items : [];
      total.value = Math.max(0, Number(result?.total) || 0);
      page.value = Math.min(nextPage, totalPages.value);
    } catch {
      if (requestSeq !== seq) return;

      loadFailed.value = true;
      items.value = [];
      total.value = 0;
    } finally {
      if (requestSeq === seq) {
        isLoading.value = false;
      }
    }
  }

  function goTo(nextPage) {
    const targetPage = Math.min(Math.max(Math.floor(Number(nextPage)) || 1, 1), totalPages.value);
    return load(targetPage);
  }

  function reset() {
    seq += 1;
    page.value = 1;
    total.value = 0;
    items.value = [];
    isLoading.value = false;
    loadFailed.value = false;
  }

  return {
    page,
    total,
    items,
    isLoading,
    loadFailed,
    totalPages,
    load,
    goTo,
    reset
  };
}
