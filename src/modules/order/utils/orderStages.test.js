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
    { orderStatus: 5 },
    { orderStatus: 6 },
    { orderStatus: 8 },
    { orderStatus: 99 }
  ]);

  assert.deepEqual(counts, {
    customerOrdered: 2,
    awaitingPayment: 0,
    awaitingShipment: 4,
    completed: 1
  });
});

test('countOrdersByStage returns all zero for empty input', () => {
  assert.deepEqual(Object.values(countOrdersByStage(null)), [0, 0, 0, 0]);
});

// 這份對照是後端 WebAPI Application/Orders/OrderStages.cs 的鏡像，兩邊要一起改。
test('ORDER_STAGES mirrors the backend stage map (待出貨 covers statuses 3 to 6)', () => {
  assert.deepEqual(
    ORDER_STAGES.map((stage) => [stage.value, stage.statuses]),
    [
      ['customerOrdered', [1]],
      ['awaitingPayment', [2]],
      ['awaitingShipment', [3, 4, 5, 6]],
      ['completed', [7, 8]]
    ]
  );
});

test('every order status 1-8 belongs to exactly one stage tab', () => {
  for (let status = 1; status <= 8; status += 1) {
    const stages = ORDER_STAGES.filter((stage) => stage.statuses.includes(status));
    assert.equal(stages.length, 1, `status ${status} is in ${stages.length} tabs`);
  }
});

test('the removed arrivedTaiwan stage is not a known stage anymore', () => {
  assert.equal(normalizeOrderStage('arrivedTaiwan'), null);
});
