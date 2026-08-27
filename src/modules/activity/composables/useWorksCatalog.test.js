import test from 'node:test';
import assert from 'node:assert/strict';
import { useWorksCatalog } from './useWorksCatalog.js';

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

test('preview and full scopes use independent requests and state', async () => {
  const calls = [];
  const preview = deferred();
  const full = deferred();
  const catalog = useWorksCatalog((limit) => {
    calls.push(limit);
    return limit === 10 ? preview.promise : full.promise;
  });
  const previewRequest = catalog.fetchHomeWorks();
  const fullRequest = catalog.fetchAllWorks();
  assert.deepEqual(calls, [10, undefined]);
  full.resolve([{ id: 2, name: 'full' }]);
  await fullRequest;
  preview.resolve([{ id: 1, name: 'preview' }]);
  await previewRequest;
  assert.deepEqual(catalog.homeWorks.value.map((work) => work.id), [1]);
  assert.deepEqual(catalog.allWorks.value.map((work) => work.id), [2]);
});

test('same-scope stale responses and errors cannot write back', async () => {
  const first = deferred();
  const second = deferred();
  let call = 0;
  const catalog = useWorksCatalog(() => (++call === 1 ? first.promise : second.promise));
  const firstRequest = catalog.fetchHomeWorks();
  const secondRequest = catalog.fetchHomeWorks();
  second.resolve([{ id: 2 }]);
  await secondRequest;
  first.reject(new Error('stale'));
  await firstRequest;
  assert.equal(catalog.homeIsLoaded.value, true);
  assert.deepEqual(catalog.homeWorks.value.map((work) => work.id), [2]);
  assert.equal(catalog.homeError.value, null);
});

test('empty full response is loaded and reset invalidates pending requests', async () => {
  const pending = deferred();
  const catalog = useWorksCatalog(() => pending.promise);
  const request = catalog.fetchAllWorks();
  pending.resolve([]);
  await request;
  assert.equal(catalog.allIsLoaded.value, true);
  assert.deepEqual(catalog.allWorks.value, []);
  const stale = deferred();
  const resetCatalog = useWorksCatalog(() => stale.promise);
  const running = resetCatalog.fetchHomeWorks();
  resetCatalog.reset();
  stale.resolve([{ id: 99 }]);
  await running;
  assert.equal(resetCatalog.homeIsLoaded.value, false);
  assert.deepEqual(resetCatalog.homeWorks.value, []);
});
