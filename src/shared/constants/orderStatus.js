export const ORDER_STATUS = {
  CUSTOMER_ORDERED: 1,
  CONFIRMATION_SENT: 2,
  CUSTOMER_PAID: 3,
  PRE_ORDER_COMPLETED: 4,
  STOCKED: 5,
  SHIPPED_TO_CUSTOMER: 6,
  COMPLETED: 7,
  CANCELED: 8
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.CUSTOMER_ORDERED]: 'order.status.customerOrdered',
  [ORDER_STATUS.CONFIRMATION_SENT]: 'order.status.confirmationSent',
  [ORDER_STATUS.CUSTOMER_PAID]: 'order.status.customerPaid',
  [ORDER_STATUS.PRE_ORDER_COMPLETED]: 'order.status.preOrderCompleted',
  [ORDER_STATUS.STOCKED]: 'order.status.stocked',
  [ORDER_STATUS.SHIPPED_TO_CUSTOMER]: 'order.status.shippedToCustomer',
  [ORDER_STATUS.COMPLETED]: 'order.status.completed',
  [ORDER_STATUS.CANCELED]: 'order.status.canceled'
};

export const ORDER_STATUS_BADGE_VARIANTS = {
  [ORDER_STATUS.CUSTOMER_ORDERED]: 'pending',
  [ORDER_STATUS.CONFIRMATION_SENT]: 'info',
  [ORDER_STATUS.CUSTOMER_PAID]: 'paid',
  [ORDER_STATUS.PRE_ORDER_COMPLETED]: 'processing',
  [ORDER_STATUS.STOCKED]: 'processing',
  [ORDER_STATUS.SHIPPED_TO_CUSTOMER]: 'shipped',
  [ORDER_STATUS.COMPLETED]: 'completed',
  [ORDER_STATUS.CANCELED]: 'canceled'
};

export function getOrderStatusLabelKey(status) {
  return ORDER_STATUS_LABELS[Number(status)] || 'order.status.unknown';
}

export function getOrderStatusBadgeVariant(status) {
  return ORDER_STATUS_BADGE_VARIANTS[Number(status)] || 'unknown';
}
