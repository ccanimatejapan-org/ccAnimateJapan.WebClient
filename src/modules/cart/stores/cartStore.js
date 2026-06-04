import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { getStorageItem, setStorageItem } from '@/shared/utils/storage';
import { shouldUseMockApi } from '@/shared/api/mockMode';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '../api/cartApi';

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

// Map a server cart payload ({ activityId, activityName, items:[...] }) to the store item shape.
function mapServerCart(cart) {
  const serverItems = Array.isArray(cart?.items) ? cart.items : [];
  const activityName = cart?.activityName || '';

  return serverItems
    .map((item) => {
      const note = normalizeNote(item.note ?? item.info);
      return {
        id: item.id,
        activityId: Number(item.activityId),
        activityName: item.activityName || activityName,
        productId: Number(item.productId),
        productName: item.productName || '',
        imageUrl: item.imageUrl || '',
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        note,
        info: note
      };
    })
    .filter((item) => Number.isFinite(item.productId));
}

export const useCartStore = defineStore('cart', () => {
  const useMock = shouldUseMockApi();
  const items = ref(useMock ? normalizeStoredItems(getStorageItem(CART_STORAGE_KEY, [])) : []);

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

  function applyServerCart(cart) {
    items.value = mapServerCart(cart);
  }

  // Pull the authoritative cart from the server (real mode only).
  async function hydrate() {
    if (useMock) return;
    try {
      applyServerCart(await getCart());
    } catch {
      // Keep whatever we have; the next successful call will reconcile.
    }
  }

  async function addItem(payload) {
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

    if (!useMock) {
      try {
        const cart = await addCartItem({
          activityId: nextActivityId,
          productId: nextProductId,
          quantity,
          note
        });
        applyServerCart(cart);
        return { ok: true };
      } catch {
        return { ok: false, reason: 'addFailed' };
      }
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

  async function updateQuantity(id, quantity) {
    const nextQuantity = Math.max(1, Number(quantity) || 1);

    if (!useMock) {
      try {
        applyServerCart(await updateCartItem(id, nextQuantity));
      } catch {
        await hydrate();
      }
      return;
    }

    const item = items.value.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity = nextQuantity;
  }

  async function removeItem(id) {
    if (!useMock) {
      try {
        applyServerCart(await removeCartItem(id));
      } catch {
        await hydrate();
      }
      return;
    }

    items.value = items.value.filter((item) => item.id !== id);
  }

  // The server clears its cart when an order is created, so this only resets local state.
  function clearCart() {
    items.value = [];
  }

  if (useMock) {
    watch(items, (value) => setStorageItem(CART_STORAGE_KEY, value), { deep: true });
  } else {
    // Load the server cart on first use (badge count, cart page, etc.).
    hydrate();
  }

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
    clearCart,
    hydrate
  };
});
