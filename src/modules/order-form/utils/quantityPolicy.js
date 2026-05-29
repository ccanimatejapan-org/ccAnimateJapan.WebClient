export function getQuantityMax(activity, product) {
  if (activity?.isPreOrder === true) return undefined;

  const amount = Number(product?.amount);
  return Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : undefined;
}

export function normalizeQuantity(activity, product, amount) {
  const nextAmount = Math.max(0, Math.floor(Number(amount) || 0));
  const maxAmount = getQuantityMax(activity, product);

  return maxAmount === undefined ? nextAmount : Math.min(maxAmount, nextAmount);
}
