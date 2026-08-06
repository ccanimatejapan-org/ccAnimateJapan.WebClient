import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOrderListQuery,
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
