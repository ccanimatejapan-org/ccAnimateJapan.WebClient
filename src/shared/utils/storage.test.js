import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getStorageItem, setStorageItem } from './storage.js';

describe('storage helpers', () => {
  let original;
  beforeEach(() => {
    original = globalThis.localStorage;
  });
  afterEach(() => {
    globalThis.localStorage = original;
  });

  it('setStorageItem does not throw when localStorage.setItem throws', () => {
    globalThis.localStorage = {
      setItem() {
        throw new Error('QuotaExceededError');
      },
      getItem() {
        return null;
      },
      removeItem() {}
    };

    assert.doesNotThrow(() => setStorageItem('k', { a: 1 }));
    assert.equal(setStorageItem('k', { a: 1 }), false);
  });

  it('setStorageItem stores and getStorageItem reads it back', () => {
    const store = {};
    globalThis.localStorage = {
      setItem(k, v) {
        store[k] = v;
      },
      getItem(k) {
        return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
      },
      removeItem(k) {
        delete store[k];
      }
    };

    assert.equal(setStorageItem('k', { a: 1 }), true);
    assert.deepEqual(getStorageItem('k'), { a: 1 });
  });

  it('getStorageItem returns the fallback on corrupted JSON', () => {
    globalThis.localStorage = {
      getItem() {
        return '{bad json';
      },
      setItem() {},
      removeItem() {}
    };

    assert.equal(getStorageItem('k', 'FALLBACK'), 'FALLBACK');
  });
});
