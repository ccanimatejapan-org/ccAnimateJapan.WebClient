import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '../api/cartApi';

function normalizeNote(note) {
  return String(note || '').trim().slice(0, 80);
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
  const items = ref([]);

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

  // Pull the authoritative cart from the server.
  async function hydrate() {
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

  let updateSeq = 0;
  async function updateQuantity(id, quantity) {
    const nextQuantity = Math.max(1, Math.floor(Number(quantity)) || 1);
    const seq = ++updateSeq;

    try {
      const cart = await updateCartItem(id, nextQuantity);
      if (seq === updateSeq) applyServerCart(cart);
      return { ok: true };
    } catch {
      if (seq !== updateSeq) return { ok: true };
      await hydrate();
      return { ok: false, reason: 'updateFailed' };
    }
  }

  async function removeItem(id) {
    try {
      applyServerCart(await removeCartItem(id));
      return { ok: true };
    } catch {
      await hydrate();
      return { ok: false, reason: 'removeFailed' };
    }
  }

  // The server clears its cart when an order is created, so this only resets local state.
  function clearCart() {
    items.value = [];
  }

  // Load the server cart on first use (badge count, cart page, etc.).
  hydrate();

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
