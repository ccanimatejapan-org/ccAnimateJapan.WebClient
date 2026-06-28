export const DELIVERY_STATUS = {
  UNPROCESSED: 6,
  URL_PROVIDED: 1,
  CUSTOMER_ORDERED: 2,
  SHIPPED: 3,
  ARRIVED_STORE: 4,
  PICKED_UP: 5
};

export const DELIVERY_STATUS_LABELS = {
  [DELIVERY_STATUS.UNPROCESSED]: 'order.deliveryStatus.unprocessed',
  [DELIVERY_STATUS.URL_PROVIDED]: 'order.deliveryStatus.urlProvided',
  [DELIVERY_STATUS.CUSTOMER_ORDERED]: 'order.deliveryStatus.customerOrdered',
  [DELIVERY_STATUS.SHIPPED]: 'order.deliveryStatus.shipped',
  [DELIVERY_STATUS.ARRIVED_STORE]: 'order.deliveryStatus.arrivedStore',
  [DELIVERY_STATUS.PICKED_UP]: 'order.deliveryStatus.pickedUp'
};

export const DELIVERY_STATUS_BADGE_VARIANTS = {
  [DELIVERY_STATUS.UNPROCESSED]: 'pending',
  [DELIVERY_STATUS.URL_PROVIDED]: 'info',
  [DELIVERY_STATUS.CUSTOMER_ORDERED]: 'processing',
  [DELIVERY_STATUS.SHIPPED]: 'shipped',
  [DELIVERY_STATUS.ARRIVED_STORE]: 'processing',
  [DELIVERY_STATUS.PICKED_UP]: 'completed'
};

export function getDeliveryStatusLabelKey(status) {
  return DELIVERY_STATUS_LABELS[Number(status)] || 'order.deliveryStatus.unknown';
}

export function getDeliveryStatusBadgeVariant(status) {
  return DELIVERY_STATUS_BADGE_VARIANTS[Number(status)] || 'unknown';
}
