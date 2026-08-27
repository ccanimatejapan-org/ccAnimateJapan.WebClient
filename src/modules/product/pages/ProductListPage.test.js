import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('./ProductListPage.vue', import.meta.url), 'utf8');
const productStoreSource = fs.readFileSync(new URL('../stores/productStore.js', import.meta.url), 'utf8');

test('product list page no longer uses page-based pagination for products', () => {
  assert.equal(source.includes('AppPagination'), false);
  assert.equal(source.includes('useServerPagination'), false);
  assert.equal(source.includes('fetchProductsByActivityPaged'), false);
  assert.equal(source.includes('load(1)'), false);
});

test('product list page uses unpaged activity products flow', () => {
  assert.equal(source.includes('useActivityProducts'), true);
  assert.equal(source.includes('fetchProductsByActivity'), true);
  assert.equal(source.includes('loadFailed'), true);
  assert.equal(source.includes('products'), true);
});

test('product list page does not import or call activity store reset', () => {
  assert.equal(source.includes('useActivityStore'), false);
  assert.equal(source.includes('activityStore.reset('), false);
});

test('product store unpaged products fetches by activityId only', () => {
  assert.equal(productStoreSource.includes('function fetchProductsByActivity(activityId)'), true);
  assert.equal(productStoreSource.includes('getProductsByActivity(activityId)'), true);
  assert.equal(productStoreSource.includes('page'), false);
  assert.equal(productStoreSource.includes('pageSize'), false);
});

test('add-to-cart confirmation is single-flight and dialog blocks pending confirmation', () => {
  assert.equal(source.includes('useSingleFlight'), true);
  assert.equal(source.includes(':is-adding="isAdding"'), true);
  const dialogSource = fs.readFileSync(new URL('../components/ProductAddDialog.vue', import.meta.url), 'utf8');
  assert.equal(dialogSource.includes('props.isAdding'), true);
  assert.equal(dialogSource.includes('isSoldOut || isAdding'), true);
});
