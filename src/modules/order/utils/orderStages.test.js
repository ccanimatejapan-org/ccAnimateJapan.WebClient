import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOrderListQuery,
  countOrdersByStage,
  normalizeOrderStage,
  ORDER_STAGES
} from './orderStages.js';

test('normalizeOrderStage returns null for unknown stage', () => {
  assert.equal(normalizeOrderStage('unknown'), null);
  assert.equal(normalizeOrderStage(''), null);
  assert.equal(normalizeOrderStage('  '), null);
});

test('normalizeOrderStage keeps valid stage values', () => {
  for (const option of ORDER_STAGES) {
    assert.equal(normalizeOrderStage(option.value), option.value);
  }
});

test('buildOrderListQuery always includes order stage and optional trimmed search', () => {
  const query = buildOrderListQuery({
    search: '  AB ',
    orderStage: 'awaitingShipment'
  });

  assert.equal(query.orderStage, 'awaitingShipment');
  assert.equal(query.search, 'AB');
});

test('countOrdersByStage groups orders by stage and defaults to zero', () => {
  const counts = countOrdersByStage([
    { orderStatus: 1 },
    { orderStatus: 1 },
    { orderStatus: 3 },
    { orderStatus: 4 },
    { orderStatus: 6 },
    { orderStatus: 8 },
    { orderStatus: 99 }
  ]);

  assert.deepEqual(counts, {
    customerOrdered: 2,
    awaitingPayment: 0,
    awaitingShipment: 3,
    completed: 1
  });
});

test('countOrdersByStage returns all zero for empty input', () => {
  assert.deepEqual(Object.values(countOrdersByStage(null)), [0, 0, 0, 0]);
});
