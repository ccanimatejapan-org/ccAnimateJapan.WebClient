export const DEFAULT_ORDER_STAGE = 'customerOrdered';

export const ORDER_STAGES = [
  { value: 'customerOrdered', labelKey: 'order.tabs.customerOrdered' },
  { value: 'awaitingPayment', labelKey: 'order.tabs.awaitingPayment' },
  { value: 'awaitingShipment', labelKey: 'order.tabs.awaitingShipment' },
  { value: 'arrivedTaiwan', labelKey: 'order.tabs.arrivedTaiwan' },
  { value: 'completed', labelKey: 'order.tabs.completed' }
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
