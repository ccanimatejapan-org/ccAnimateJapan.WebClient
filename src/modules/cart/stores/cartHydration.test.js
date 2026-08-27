import test from 'node:test';
import assert from 'node:assert/strict';
import { createCartHydrationCoordinator } from './cartHydration.js';

function deferred() { let resolve; const promise = new Promise((res) => { resolve = res; }); return { promise, resolve }; }

test('ensureHydrated is single-flight and successful hydration is cached', async () => {
  const request = deferred();
  let calls = 0;
  const applied = [];
  const coordinator = createCartHydrationCoordinator(async () => { calls += 1; return request.promise; }, (cart) => applied.push(cart));
  const first = coordinator.ensureHydrated();
  const second = coordinator.ensureHydrated();
  assert.strictEqual(first, second);
  request.resolve({ items: [1] });
  await first;
  await coordinator.ensureHydrated();
  assert.equal(calls, 1);
  assert.deepEqual(applied, [{ items: [1] }]);
});

test('failure releases in-flight state and hydrate can force refresh', async () => {
  let calls = 0;
  const coordinator = createCartHydrationCoordinator(async () => { calls += 1; if (calls === 1) throw new Error('bad'); return { items: [] }; }, () => {});
  await coordinator.ensureHydrated();
  await coordinator.ensureHydrated();
  assert.equal(calls, 2);
  await coordinator.hydrate();
  assert.equal(calls, 3);
});

test('clear invalidates an old response and resets loaded state', async () => {
  const request = deferred();
  const applied = [];
  const coordinator = createCartHydrationCoordinator(() => request.promise, (cart) => applied.push(cart));
  const pending = coordinator.ensureHydrated();
  coordinator.clear();
  request.resolve({ items: ['old-member'] });
  await pending;
  assert.equal(coordinator.isHydrated.value, false);
  assert.deepEqual(applied, []);
});
