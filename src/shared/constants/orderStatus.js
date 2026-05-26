export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'order.status.pending',
  [ORDER_STATUS.PAID]: 'order.status.paid',
  [ORDER_STATUS.SHIPPED]: 'order.status.shipped',
  [ORDER_STATUS.COMPLETED]: 'order.status.completed',
  [ORDER_STATUS.CANCELLED]: 'order.status.cancelled'
};
