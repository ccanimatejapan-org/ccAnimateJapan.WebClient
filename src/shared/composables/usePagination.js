import { computed, ref, watch } from 'vue';

export function usePagination(items, pageSize = 12) {
  const page = ref(1);

  const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)));
  const pagedItems = computed(() => {
    const start = (page.value - 1) * pageSize;
    return items.value.slice(start, start + pageSize);
  });

  watch(totalPages, (max) => {
    if (page.value > max) {
      page.value = max;
    }
  }, { flush: 'sync' });

  function setPage(nextPage) {
    page.value = Math.min(Math.max(nextPage, 1), totalPages.value);
  }

  return {
    page,
    totalPages,
    pagedItems,
    setPage
  };
}
