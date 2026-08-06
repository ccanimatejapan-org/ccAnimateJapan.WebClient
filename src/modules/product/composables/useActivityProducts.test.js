import test from 'node:test';
import assert from 'node:assert/strict';
import { useActivityProducts } from './useActivityProducts.js';

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

test('fetcher only receives the activityId', async () => {
  const calls = [];
  const fetcher = async (activityId, ...rest) => {
    calls.push({ activityId, rest });
    return [{ id: 1 }, { id: 2 }];
  };

  const { products, isLoading, loadFailed, load } = useActivityProducts(fetcher);

  assert.equal(isLoading.value, false);
  assert.equal(loadFailed.value, false);
  assert.deepEqual(products.value, []);

  await load(7);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].activityId, 7);
  assert.equal(calls[0].rest.length, 0);
});

test('keeps all products (13+) returned by the fetcher', async () => {
  const allProducts = Array.from({ length: 13 }, (_, index) => ({ id: index + 1 }));
  const fetcher = async () => allProducts;

  const { products, loadFailed, load } = useActivityProducts(fetcher);
  await load(1);

  assert.equal(loadFailed.value, false);
  assert.equal(products.value.length, 13);
  assert.deepEqual(products.value, allProducts);
});

test('immediately clears stale products and state when a new load starts while previous load is pending', async () => {
  const firstCall = createDeferred();
  const secondCall = createDeferred();
  const fetcher = async (activityId) => {
    if (activityId === 1) return firstCall.promise;
    return secondCall.promise;
  };

  const { products, isLoading, loadFailed, load } = useActivityProducts(fetcher);
  const firstLoad = load(1);
  firstCall.resolve([{ id: 1 }, { id: 2 }]);
  await firstLoad;

  assert.deepEqual(products.value, [{ id: 1 }, { id: 2 }]);
  assert.equal(isLoading.value, false);
  assert.equal(loadFailed.value, false);

  const pendingLoad = load(2);
  assert.deepEqual(products.value, []);
  assert.equal(isLoading.value, true);
  assert.equal(loadFailed.value, false);

  secondCall.resolve([{ id: 3 }, { id: 4 }]);
  await pendingLoad;

  assert.deepEqual(products.value, [{ id: 3 }, { id: 4 }]);
});

test('failure clears products and sets loadFailed', async () => {
  const fetcher = async () => {
    throw new Error('bad request');
  };

  const { products, loadFailed, load } = useActivityProducts(fetcher);

  await load(1);

  assert.equal(loadFailed.value, true);
  assert.deepEqual(products.value, []);
});

test('stale response and stale error are ignored when activityId changes quickly', async () => {
  const firstCall = createDeferred();
  const secondCall = createDeferred();
  const fetcher = async (activityId) => {
    if (activityId === 1) return firstCall.promise;
    return secondCall.promise;
  };

  const { products, loadFailed, load } = useActivityProducts(fetcher);
  const firstLoad = load(1);
  const secondLoad = load(2);

  secondCall.resolve([{ id: 20 }]);
  firstCall.reject(new Error('stale'));

  await secondLoad;
  await firstLoad;

  assert.equal(loadFailed.value, false);
  assert.deepEqual(products.value, [{ id: 20 }]);
});

test('reset makes previous pending request invalid', async () => {
  const pending = createDeferred();
  const fetcher = async () => pending.promise;

  const { products, loadFailed, isLoading, reset, load } = useActivityProducts(fetcher);
  const request = load(1);
  reset();
  pending.resolve([{ id: 1 }]);

  await request;

  assert.equal(isLoading.value, false);
  assert.equal(loadFailed.value, false);
  assert.deepEqual(products.value, []);
});
