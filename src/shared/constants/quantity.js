export const MAX_ORDER_QUANTITY = 50;

export function clampQuantity(value, max = MAX_ORDER_QUANTITY) {
  const next = Math.floor(Number(value) || 1);
  const cap = Number.isFinite(max) && max > 0 ? Math.min(max, MAX_ORDER_QUANTITY) : MAX_ORDER_QUANTITY;
  return Math.min(cap, Math.max(1, next));
}
