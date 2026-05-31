import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { getStorageItem, setStorageItem } from '@/shared/utils/storage';

const CART_STORAGE_KEY = 'ccAnimateJapan.cart';

function normalizeNote(note) {
  return String(note || '').trim().slice(0, 80);
}

function createLineItemId(activityId, productId, note) {
  return `${Number(activityId)}:${Number(productId)}:${normalizeNote(note)}`;
}

function normalizeStoredItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const activityId = Number(item.activityId);
      const productId = Number(item.productId ?? item.id);
      const quantity = Math.max(1, Number(item.quantity) || 1);

      if (!Number.isFinite(activityId) || !Number.isFinite(productId)) return null;

      const note = normalizeNote(item.note ?? item.info);
      const productName = item.productName || item.name || '';

      return {
        id: item.id || createLineItemId(activityId, productId, note),
        activityId,
        activityName: item.activityName || '',
        productId,
        productName,
        imageUrl: item.imageUrl || '',
        price: Number(item.price) || 0,
        quantity,
        note,
        info: note
      };
    })
    .filter(Boolean);
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(normalizeStoredItems(getStorageItem(CART_STORAGE_KEY, [])));

  const totalQuantity = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  const activityId = computed(() => items.value[0]?.activityId || null);
  const activityName = computed(() => items.value[0]?.activityName || '');

  function canAddActivity(nextActivityId) {
    if (items.value.length === 0) return true;
    return Number(activityId.value) === Number(nextActivityId);
  }

  function addItem(payload) {
    if (!payload || typeof payload !== 'object') {
      return { ok: false, reason: 'invalidItem' };
    }

    const activity = payload.activity || {};
    const product = payload.product || payload;
    const nextActivityId = Number(payload.activityId ?? activity?.id ?? product?.activityId);
    const nextProductId = Number(payload.productId ?? product?.id);
    const note = normalizeNote(payload.note ?? payload.info);
    const quantity = Math.max(1, Number(payload.quantity) || 1);
    if (!Number.isFinite(nextActivityId) || !Number.isFinite(nextProductId)) {
      return { ok: false, reason: 'invalidItem' };
    }

    if (!canAddActivity(nextActivityId)) {
      return { ok: false, reason: 'mixedActivity' };
    }

    const id = createLineItemId(nextActivityId, nextProductId, note);
    const existing = items.value.find((item) => item.id === id);
    if (existing) {
      existing.quantity += quantity;
      return { ok: true, item: existing };
    }

    const item = {
      id,
      activityId: nextActivityId,
      activityName: payload.activityName || activity?.name || '',
      productId: nextProductId,
      productName: payload.productName || product?.name || '',
      imageUrl: payload.imageUrl || product?.imageUrl || '',
      price: Number(payload.price ?? product?.price) || 0,
      quantity,
      note,
      info: note
    };

    items.value.push(item);
    return { ok: true, item };
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
    activityId,
    activityName,
    canAddActivity,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  };
});
