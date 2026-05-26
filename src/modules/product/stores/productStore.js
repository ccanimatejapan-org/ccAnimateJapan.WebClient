import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getProducts } from '../api/productApi';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const isLoaded = ref(false);
  const selectedCategory = ref('all');

  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') return products.value;
    return products.value.filter((product) => product.category === selectedCategory.value);
  });

  const featuredProducts = computed(() =>
    products.value.filter((product) => product.featured).slice(0, 3)
  );

  async function fetchProducts() {
    products.value = await getProducts();
    isLoaded.value = true;
  }

  function setCategory(category) {
    selectedCategory.value = category;
  }

  if (!isLoaded.value) {
    fetchProducts();
  }

  return {
    products,
    isLoaded,
    selectedCategory,
    filteredProducts,
    featuredProducts,
    fetchProducts,
    setCategory
  };
});
