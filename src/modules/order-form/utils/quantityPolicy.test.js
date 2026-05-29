import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getQuantityMax, normalizeQuantity } from './quantityPolicy.js';

describe('order form quantity policy', () => {
  it('does not cap quantity by amount for pre-order activities', () => {
    const activity = { isPreOrder: true };
    const product = { amount: 0 };

    assert.equal(getQuantityMax(activity, product), undefined);
    assert.equal(normalizeQuantity(activity, product, 5), 5);
  });

  it('caps quantity by amount for stock activities', () => {
    const activity = { isPreOrder: false };
    const product = { amount: 3 };

    assert.equal(getQuantityMax(activity, product), 3);
    assert.equal(normalizeQuantity(activity, product, 5), 3);
  });
});
