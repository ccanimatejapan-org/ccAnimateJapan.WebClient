import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { getStorageItem, setStorageItem } from '@/shared/utils/storage';

const CART_STORAGE_KEY = 'ccAnimateJapan.cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref(getStorageItem(CART_STORAGE_KEY, []));

  const totalQuantity = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  function addItem(product) {
    const existing = items.value.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
      return;
    }

    items.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    });
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity = Math.max(1, quantity);
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  function clearCart() {
    items.value = [];
  }

  watch(items, (value) => setStorageItem(CART_STORAGE_KEY, value), { deep: true });

  return {
    items,
    totalQuantity,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  };
});
