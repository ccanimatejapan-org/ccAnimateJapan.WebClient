function normalizeNote(note) {
  return String(note || '').trim().slice(0, 80);
}

function normalizeItemId(value) {
  const id = Number(value);
  return Number.isFinite(id) && Number.isInteger(id) && id > 0 ? id : null;
}

export function mapServerCartItem(item) {
  const note = normalizeNote(item?.note ?? item?.info);
  const activityId = normalizeItemId(item?.activityId);
  const productId = normalizeItemId(item?.productId);

  if (!Number.isFinite(activityId) || !Number.isFinite(productId)) {
    return null;
  }

  return {
    id: item?.id ?? null,
    activityId,
    activityName: item?.activityName || '',
    productId,
    productName: item?.productName || '',
    imageUrl: item?.imageUrl || '',
    price: Number(item?.price) || 0,
    quantity: Math.max(1, Number(item?.quantity) || 1),
    note,
    info: note,
    activityIsPreOrder: item?.activityIsPreOrder,
    officialShippingStartTime: item?.officialShippingStartTime,
    officialShippingEndTime: item?.officialShippingEndTime
  };
}

export function mapServerCart(cart) {
  const serverItems = Array.isArray(cart?.items) ? cart.items : [];
  const mapped = serverItems
    .map((item) => mapServerCartItem(item))
    .filter(Boolean);

  return mapped;
}

export function mapCartGroups(items = []) {
  const map = new Map();

  for (const item of items) {
    const key = Number(item?.activityId);
    if (!Number.isFinite(key)) {
      continue;
    }

    if (!map.has(key)) {
      map.set(key, {
        activityId: key,
        activityName: item.activityName || '',
        activityIsPreOrder: item.activityIsPreOrder,
        officialShippingStartTime: item.officialShippingStartTime,
        officialShippingEndTime: item.officialShippingEndTime,
        items: [],
        subtotal: 0,
        totalQuantity: 0
      });
    }

    const group = map.get(key);
    group.items.push(item);
    group.subtotal += item.price * item.quantity;
    group.totalQuantity += item.quantity;
  }

  return [...map.values()];
}

