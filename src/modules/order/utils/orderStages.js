import { ORDER_STATUS } from '../../../shared/constants/orderStatus.js';

// 顧客端「我的訂單」4 個分頁與狀態碼的分組，是後端 WebAPI Application/Orders/OrderStages.cs 的鏡像（兩邊要一致）。
// 待出貨（awaitingShipment）涵蓋狀態 3 顧客已付款、4 預購已完成、5 商品已入庫、6 已聯絡顧客出貨事項；
// 狀態 1 到 8 必須各屬於恰好一個分頁，否則該狀態的訂單在 /orders 會完全看不到。
export const DEFAULT_ORDER_STAGE = 'customerOrdered';

export const ORDER_STAGES = [
  { value: 'customerOrdered', labelKey: 'order.tabs.customerOrdered', statuses: [ORDER_STATUS.CUSTOMER_ORDERED] },
  { value: 'awaitingPayment', labelKey: 'order.tabs.awaitingPayment', statuses: [ORDER_STATUS.CONFIRMATION_SENT] },
  {
    value: 'awaitingShipment',
    labelKey: 'order.tabs.awaitingShipment',
    statuses: [
      ORDER_STATUS.CUSTOMER_PAID,
      ORDER_STATUS.PRE_ORDER_COMPLETED,
      ORDER_STATUS.STOCKED,
      ORDER_STATUS.SHIPPED_TO_CUSTOMER
    ]
  },
  { value: 'completed', labelKey: 'order.tabs.completed', statuses: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELED] }
];

const KNOWN_STAGES = new Set(ORDER_STAGES.map((option) => option.value));

export function normalizeOrderStage(orderStage) {
  return KNOWN_STAGES.has(orderStage || '') ? orderStage : null;
}

export function buildOrderListQuery({ search = '', orderStage }) {
  const params = {};
  const keyword = typeof search === 'string' ? search.trim() : '';
  const normalizedOrderStage = normalizeOrderStage(orderStage) ?? DEFAULT_ORDER_STAGE;

  if (keyword) {
    params.search = keyword;
  }

  params.orderStage = normalizedOrderStage;

  return params;
}

export function countOrdersByStage(orders) {
  const counts = Object.fromEntries(ORDER_STAGES.map((stage) => [stage.value, 0]));

  for (const order of Array.isArray(orders) ? orders : []) {
    const status = Number(order?.orderStatus);
    const stage = ORDER_STAGES.find((option) => option.statuses.includes(status));

    if (stage) {
      counts[stage.value] += 1;
    }
  }

  return counts;
}
