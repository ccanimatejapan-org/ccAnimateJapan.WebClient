import { ref } from 'vue';

function normalizeWorks(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((work) => work?.id != null).map((work) => ({
    id: work.id,
    name: work.name,
    imageUrl: work.imageUrl || '',
    count: work.activityCount ?? 0
  }));
}

export function useWorksCatalog(fetcher) {
  const homeWorks = ref([]);
  const allWorks = ref([]);
  const homeIsLoaded = ref(false);
  const allIsLoaded = ref(false);
  const homeIsLoading = ref(false);
  const allIsLoading = ref(false);
  const homeError = ref(null);
  const allError = ref(null);
  const sequence = { home: 0, all: 0 };

  async function fetchScope(scope, limit) {
    const isHome = scope === 'home';
    const requestSequence = ++sequence[scope];
    const works = isHome ? homeWorks : allWorks;
    const loaded = isHome ? homeIsLoaded : allIsLoaded;
    const loading = isHome ? homeIsLoading : allIsLoading;
    const error = isHome ? homeError : allError;
    loading.value = true;
    error.value = null;
    try {
      const result = await fetcher(limit);
      if (requestSequence !== sequence[scope]) return;
      works.value = normalizeWorks(result);
      loaded.value = true;
    } catch (err) {
      if (requestSequence !== sequence[scope]) return;
      error.value = err;
      works.value = [];
      loaded.value = false;
    } finally {
      if (requestSequence === sequence[scope]) loading.value = false;
    }
  }

  function reset() {
    sequence.home += 1;
    sequence.all += 1;
    homeWorks.value = [];
    allWorks.value = [];
    homeIsLoaded.value = false;
    allIsLoaded.value = false;
    homeIsLoading.value = false;
    allIsLoading.value = false;
    homeError.value = null;
    allError.value = null;
  }

  return {
    homeWorks, allWorks, homeIsLoaded, allIsLoaded,
    homeIsLoading, allIsLoading, homeError, allError,
    fetchHomeWorks: (limit = 10) => fetchScope('home', limit),
    fetchAllWorks: () => fetchScope('all'),
    reset
  };
}
