import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getActivityById } from '@/modules/activity/api/activityApi';
import { getProducts, getProductsByActivity } from '../api/productApi';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const activity = ref(null);
  const activeActivityId = ref(null);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedCategory = ref('all');

  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') return products.value;
    return products.value.filter((product) => product.category === selectedCategory.value);
  });

  const featuredProducts = computed(() =>
    products.value.filter((product) => product.featured).slice(0, 3)
  );

  async function fetchProducts(params = {}) {
    isLoading.value = true;
    error.value = null;

    try {
      products.value = await getProducts(params);
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
    if (activeActivityId.value === normalizedActivityId && isLoaded.value) return;

    activeActivityId.value = normalizedActivityId;
    activity.value = null;
    products.value = [];
    selectedCategory.value = 'all';
    isLoading.value = true;
    error.value = null;

    try {
      const [nextActivity, nextProducts] = await Promise.all([
        getActivityById(normalizedActivityId),
        getProductsByActivity(normalizedActivityId)
      ]);

      activity.value = nextActivity;
      products.value = nextProducts;
      isLoaded.value = true;
    } catch (err) {
      error.value = err;
      activity.value = null;
      products.value = [];
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
