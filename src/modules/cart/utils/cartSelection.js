// 購物車「選活動結帳」的規則：以活動為單位勾選，只有後端標示可結帳（activityOrderable）的活動能被選。
// 結帳頁網址帶 ?activities=8,15，重新整理也不會遺失選擇。

function toActivityId(value) {
  const id = Number(String(value).trim());
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function parseActivityIds(value) {
  const parts = (Array.isArray(value) ? value : [value])
    .filter((part) => part !== undefined && part !== null)
    .flatMap((part) => String(part).split(','));

  const ids = [];
  for (const part of parts) {
    const id = toActivityId(part);
    if (id !== null && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

export function formatActivityIds(ids) {
  return ids.join(',');
}

export function toggleActivityId(ids, activityId) {
  return ids.includes(activityId) ? ids.filter((id) => id !== activityId) : [...ids, activityId];
}

export function selectableActivityIds(groups) {
  return groups.filter((group) => group.activityOrderable).map((group) => group.activityId);
}

export function pruneSelection(ids, groups) {
  const selectable = selectableActivityIds(groups);
  return ids.filter((id) => selectable.includes(id));
}

export function pickGroups(groups, ids) {
  return groups.filter((group) => group.activityOrderable && ids.includes(group.activityId));
}

export function summarizeGroups(groups) {
  return {
    activityCount: groups.length,
    totalQuantity: groups.reduce((total, group) => total + group.totalQuantity, 0),
    subtotal: groups.reduce((total, group) => total + group.subtotal, 0),
    items: groups.flatMap((group) => group.items)
  };
}
