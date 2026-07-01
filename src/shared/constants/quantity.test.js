import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clampQuantity, MAX_ORDER_QUANTITY } from './quantity.js';

describe('clampQuantity', () => {
  it('caps values above the frontend maximum', () => {
    assert.equal(clampQuantity(51), MAX_ORDER_QUANTITY);
    assert.equal(clampQuantity(999), MAX_ORDER_QUANTITY);
  });

  it('keeps values within range unchanged', () => {
    assert.equal(clampQuantity(1), 1);
    assert.equal(clampQuantity(50), 50);
    assert.equal(clampQuantity(12), 12);
  });

  it('floors to at least 1 for invalid or low values', () => {
    assert.equal(clampQuantity(0), 1);
    assert.equal(clampQuantity(-5), 1);
    assert.equal(clampQuantity(NaN), 1);
    assert.equal(clampQuantity('abc'), 1);
    assert.equal(clampQuantity(3.9), 3);
  });

  it('honours a stricter stock cap but never exceeds the frontend maximum', () => {
    assert.equal(clampQuantity(999, 10), 10);
    assert.equal(clampQuantity(5, 10), 5);
    assert.equal(clampQuantity(999, 999), MAX_ORDER_QUANTITY);
  });
});
