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
    officialShippingEndTime: item?.officialShippingEndTime,
    // 後端判斷活動目前能否結帳；舊版後端沒有這個欄位時當作可結帳（送出時後端仍會再擋）
    activityOrderable: item?.activityOrderable !== false
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
        activityOrderable: true,
        items: [],
        subtotal: 0,
        totalQuantity: 0
      });
    }

    const group = map.get(key);
    group.items.push(item);
    group.activityOrderable = group.activityOrderable && item.activityOrderable !== false;
    group.subtotal += item.price * item.quantity;
    group.totalQuantity += item.quantity;
  }

  return [...map.values()];
}

