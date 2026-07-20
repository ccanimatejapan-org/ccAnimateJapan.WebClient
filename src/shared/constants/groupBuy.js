// 團購 / 運費相關的後端字串值（與 AdminAPI、DB 一致）。
// 顧客端用來判斷開團進度與運費模式，集中管理避免各元件散落字面值。
export const GROUP_BUY_STATUS = {
  NOT_REQUIRED: 'NotRequired',
  RECRUITING: 'Recruiting',
  FORMED: 'Formed',
  FAILED: 'Failed'
};

export const SHIPPING_MODE = {
  PER_ITEM_PREPAID: 'PerItemPrepaid',
  FREE_OVER_AMOUNT: 'FreeOverAmount',
  NO_SHIPPING: 'NoShipping'
};
