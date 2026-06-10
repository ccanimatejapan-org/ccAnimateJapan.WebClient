// 首頁活動篩選的純函式（集中邏輯，方便重用與測試）。

/**
 * 依「可預購／現貨」篩選活動。
 * @param {Array} activities 活動陣列
 * @param {'all'|'preOrder'|'inStock'} value 篩選值
 * @returns {Array}
 */
export function filterByAvailability(activities, value) {
  const list = Array.isArray(activities) ? activities : [];

  if (value === 'preOrder') {
    return list.filter((activity) => activity?.isPreOrder === true);
  }

  if (value === 'inStock') {
    return list.filter((activity) => activity?.isPreOrder === false);
  }

  return list;
}
