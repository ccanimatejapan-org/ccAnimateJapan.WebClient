const STATUS_MAP = Object.freeze({
  none: { labelKey: 'order.shippingPaymentStatus.none', variant: 'neutral' },
  unpaid: { labelKey: 'order.shippingPaymentStatus.unpaid', variant: 'pending' },
  paid: { labelKey: 'order.shippingPaymentStatus.paid', variant: 'paid' },
  unknown: { labelKey: 'order.shippingPaymentStatus.unknown', variant: 'neutral' }
});

export function mapShippingPaymentStatus(status) {
  return STATUS_MAP[status] || STATUS_MAP.unknown;
}
