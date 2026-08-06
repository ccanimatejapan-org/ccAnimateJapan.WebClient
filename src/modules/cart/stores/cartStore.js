import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '../api/cartApi';
import { mapCartGroups, mapServerCart } from '../utils/cartMapper';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  const totalQuantity = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  const groups = computed(() => mapCartGroups(items.value));

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
      return { ok: false, reason: 'error' };
    }

    const activity = payload.activity || {};
    const product = payload.product || payload;
    const nextActivityId = Number(payload.activityId ?? activity?.id ?? product?.activityId);
    const nextProductId = Number(payload.productId ?? product?.id);
    const note = String(payload.note ?? payload.info ?? '').trim().slice(0, 80);
    const quantity = Math.max(1, Number(payload.quantity) || 1);
    if (!Number.isFinite(nextActivityId) || !Number.isFinite(nextProductId)) {
      return { ok: false, reason: 'error' };
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
      return { ok: false, reason: 'error' };
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

  // Reset member-scoped local cart state.
  function clearCart() {
    items.value = [];
  }

  // Load the server cart on first use (badge count, cart page, etc.).
  hydrate();

  return {
    items,
    totalQuantity,
    subtotal,
    groups,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    hydrate
  };
});
