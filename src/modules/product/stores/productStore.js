import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getProducts, getProductsByActivity } from '../api/productApi';
import { useActivityStore } from '@/modules/activity/stores/activityStore';

function normalizeProducts(value) {
  if (!Array.isArray(value)) return [];

  return value.filter((product) => product?.id != null);
}

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const activity = ref(null);
  const activeActivityId = ref(null);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedCategory = ref('all');

  const availableProducts = computed(() => normalizeProducts(products.value));

  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') return availableProducts.value;
    return availableProducts.value.filter((product) => product.category === selectedCategory.value);
  });

  const featuredProducts = computed(() =>
    availableProducts.value.filter((product) => product.featured).slice(0, 3)
  );

  async function fetchProducts(params = {}) {
    isLoading.value = true;
    error.value = null;

    try {
      products.value = normalizeProducts(await getProducts(params));
      isLoaded.value = true;
    } catch (err) {
      error.value = err;
      products.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProductsByActivity(activityId) {
    const normalizedActivityId = Number(activityId);
    if (!Number.isFinite(normalizedActivityId) || normalizedActivityId <= 0) {
      activeActivityId.value = null;
      activity.value = null;
      products.value = [];
      selectedCategory.value = 'all';
      isLoaded.value = true;
      isLoading.value = false;
      error.value = null;
      return { ok: false, reason: 'missingActivity' };
    }

    if (activeActivityId.value === normalizedActivityId && isLoaded.value && activity.value) {
      return { ok: true, activity: activity.value, products: products.value };
    }

    activeActivityId.value = normalizedActivityId;
    activity.value = null;
    products.value = [];
    selectedCategory.value = 'all';
    isLoading.value = true;
    error.value = null;

    try {
      const activityStore = useActivityStore();
      const [productList, nextActivity] = await Promise.all([
        getProductsByActivity(normalizedActivityId),
        activityStore.getOrFetchActivity(normalizedActivityId)
      ]);

      if (!nextActivity?.id) {
        isLoaded.value = true;
        return { ok: false, reason: 'activityNotFound' };
      }

      activity.value = nextActivity;
      products.value = normalizeProducts(productList);
      isLoaded.value = true;
      return { ok: true, activity: activity.value, products: products.value };
    } catch (err) {
      error.value = err;
      activity.value = null;
      products.value = [];
      return { ok: false, reason: 'error', error: err };
    } finally {
      isLoading.value = false;
    }
  }

  function setCategory(category) {
    selectedCategory.value = category;
  }

  return {
    products,
    activity,
    activeActivityId,
    isLoaded,
    isLoading,
    error,
    selectedCategory,
    filteredProducts,
    featuredProducts,
    fetchProducts,
    fetchProductsByActivity,
    setCategory
  };
});
