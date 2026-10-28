import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '../api/cartApi';
import { mapCartGroups, mapServerCart } from '../utils/cartMapper';
import { pickGroups, pruneSelection, selectableActivityIds, summarizeGroups, toggleActivityId } from '../utils/cartSelection';
import { MAX_ORDER_QUANTITY } from '@/shared/constants/quantity';
import { createCartHydrationCoordinator } from './cartHydration';

const MAX_PRODUCT_QUANTITY_ERROR = 'MAX_PRODUCT_QUANTITY_EXCEEDED';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  function productQuantity(productId, excludeId = null) {
    return items.value.reduce((total, item) => {
      if (item.productId !== productId || item.id === excludeId) return total;
      return total + item.quantity;
    }, 0);
  }

  const totalQuantity = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  const groups = computed(() => mapCartGroups(items.value));

  // 勾選要結帳的活動：只存在記憶體，離開購物車再回來會保留，重新開網站就清空（預設全部不勾）。
  const selectedActivityIds = ref([]);
  const selectableIds = computed(() => selectableActivityIds(groups.value));
  const selectedGroups = computed(() => pickGroups(groups.value, selectedActivityIds.value));
  const selection = computed(() => summarizeGroups(selectedGroups.value));
  const isAllSelected = computed(() =>
    selectableIds.value.length > 0 && selectableIds.value.every((id) => selectedActivityIds.value.includes(id))
  );

  function setSelection(ids) {
    selectedActivityIds.value = pruneSelection(ids, groups.value);
  }

  function toggleActivity(activityId) {
    setSelection(toggleActivityId(selectedActivityIds.value, activityId));
  }

  function setAllSelected(selected) {
    selectedActivityIds.value = selected ? [...selectableIds.value] : [];
  }

  function clearSelection() {
    selectedActivityIds.value = [];
  }

  function applyServerCart(cart) {
    items.value = mapServerCart(cart);
    // 活動的商品全刪光、或活動已不能結帳時，勾選一起拿掉
    setSelection(selectedActivityIds.value);
  }

  // Pull the authoritative cart from the server.
  const hydration = createCartHydrationCoordinator(getCart, applyServerCart);
  let memberSessionEpoch = 0;

  async function addItem(payload) {
    if (!payload || typeof payload !== 'object') {
      return { ok: false, reason: 'error' };
    }

    const activity = payload.activity || {};
    const product = payload.product || payload;
    const nextActivityId = Number(payload.activityId ?? activity?.id ?? product?.activityId);
    const nextProductId = Number(payload.productId ?? product?.id);
    const note = String(payload.note ?? '').trim().slice(0, 80);
    const quantity = Math.max(1, Number(payload.quantity) || 1);
    if (!Number.isFinite(nextActivityId) || !Number.isFinite(nextProductId)) {
      return { ok: false, reason: 'error' };
    }

    if (productQuantity(nextProductId) + quantity > MAX_ORDER_QUANTITY) {
      return { ok: false, reason: 'quantityLimit' };
    }

    const requestEpoch = memberSessionEpoch;

    try {
      const cart = await addCartItem({
        activityId: nextActivityId,
        productId: nextProductId,
        quantity,
        note
      });
      if (requestEpoch === memberSessionEpoch) applyServerCart(cart);
      return { ok: true };
    } catch (error) {
      if (requestEpoch !== memberSessionEpoch) return { ok: true };
      if (error?.message === MAX_PRODUCT_QUANTITY_ERROR) {
        await hydration.hydrate();
        return { ok: false, reason: 'quantityLimit' };
      }
      return { ok: false, reason: 'error' };
    }
  }

  let updateSeq = 0;
  async function updateQuantity(id, quantity) {
    const nextQuantity = Math.max(1, Math.floor(Number(quantity)) || 1);
    const currentItem = items.value.find((item) => item.id === id);
    if (currentItem && productQuantity(currentItem.productId, id) + nextQuantity > MAX_ORDER_QUANTITY) {
      return { ok: false, reason: 'quantityLimit' };
    }
    const seq = ++updateSeq;
    const requestEpoch = memberSessionEpoch;

    try {
      const cart = await updateCartItem(id, nextQuantity);
      if (seq === updateSeq && requestEpoch === memberSessionEpoch) applyServerCart(cart);
      return { ok: true };
    } catch (error) {
      if (seq !== updateSeq || requestEpoch !== memberSessionEpoch) return { ok: true };
      await hydration.hydrate();
      return {
        ok: false,
        reason: error?.message === MAX_PRODUCT_QUANTITY_ERROR ? 'quantityLimit' : 'updateFailed'
      };
    }
  }

  async function removeItem(id) {
    const requestEpoch = memberSessionEpoch;

    try {
      const cart = await removeCartItem(id);
      if (requestEpoch === memberSessionEpoch) applyServerCart(cart);
      return { ok: true };
    } catch {
      if (requestEpoch !== memberSessionEpoch) return { ok: true };
      await hydration.hydrate();
      return { ok: false, reason: 'removeFailed' };
    }
  }

  function clearCart() {
    memberSessionEpoch += 1;
    updateSeq += 1;
    hydration.clear();
    items.value = [];
    clearSelection();
  }

  return {
    items,
    totalQuantity,
    subtotal,
    groups,
    selectedActivityIds,
    selectableIds,
    selectedGroups,
    selection,
    isAllSelected,
    setSelection,
    toggleActivity,
    setAllSelected,
    clearSelection,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    hydrate: hydration.hydrate,
    ensureHydrated: hydration.ensureHydrated,
    isHydrated: hydration.isHydrated
  };
});
