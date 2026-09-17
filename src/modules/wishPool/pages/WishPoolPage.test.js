import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('./WishPoolPage.vue', import.meta.url), 'utf8');

test('WishPool page keeps form modal entry but uses icon-only add button', () => {
  assert.equal(source.includes('openForm'), true);
  assert.equal(source.includes('AppModal'), true);
  assert.equal(source.includes('aria-label="'), true);
  assert.equal(source.includes("aria-label=\"{{ t('wishPool.addWish') }}\""), false);
  assert.equal(source.includes("t('wishPool.addWish')"), true);
  assert.equal(source.includes('<svg'), true);
});

test('WishPool add button icon is accessible and meets interaction contract', () => {
  assert.equal(source.includes('aria-hidden="true"'), true);
  assert.equal(source.includes('type="button"'), true);
  assert.equal(source.includes('wish-pool-page__add-button'), true);
});
