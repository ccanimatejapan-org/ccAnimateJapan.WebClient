import test from 'node:test';
import assert from 'node:assert/strict';
import { mapShippingPaymentStatus } from './shippingPaymentStatus.js';

test('maps the three API shipping payment states without collapsing none into unpaid', () => {
  assert.deepEqual(mapShippingPaymentStatus('paid'), { labelKey: 'order.shippingPaymentStatus.paid', variant: 'paid' });
  assert.deepEqual(mapShippingPaymentStatus('unpaid'), { labelKey: 'order.shippingPaymentStatus.unpaid', variant: 'pending' });
  assert.deepEqual(mapShippingPaymentStatus('none'), { labelKey: 'order.shippingPaymentStatus.none', variant: 'neutral' });
  assert.deepEqual(mapShippingPaymentStatus('bad-value'), { labelKey: 'order.shippingPaymentStatus.unknown', variant: 'neutral' });
});
