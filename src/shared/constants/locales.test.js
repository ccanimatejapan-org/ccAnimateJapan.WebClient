import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getInitialLocale,
  htmlLangFor,
  LOCALE_STORAGE_KEY,
  normalizeLocale
} from './locales.js';

describe('normalizeLocale', () => {
  it('returns supported locale codes unchanged', () => {
    assert.equal(normalizeLocale('en'), 'en');
    assert.equal(normalizeLocale('zh-TW'), 'zh-TW');
  });

  it('falls back to zh-TW for unsupported values', () => {
    assert.equal(normalizeLocale('fr'), 'zh-TW');
    assert.equal(normalizeLocale(null), 'zh-TW');
    assert.equal(normalizeLocale(undefined), 'zh-TW');
    assert.equal(normalizeLocale(''), 'zh-TW');
  });
});

describe('htmlLangFor', () => {
  it('maps supported locales to html lang values', () => {
    assert.equal(htmlLangFor('zh-TW'), 'zh-Hant');
    assert.equal(htmlLangFor('en'), 'en');
  });

  it('falls back to zh-Hant for unsupported values', () => {
    assert.equal(htmlLangFor('bad'), 'zh-Hant');
  });
});

describe('getInitialLocale', () => {
  function withLocalStorage(value, callback) {
    const previous = globalThis.localStorage;
    globalThis.localStorage = {
      getItem(key) {
        return key === LOCALE_STORAGE_KEY ? value : null;
      }
    };

    try {
      callback();
    } finally {
      if (previous === undefined) {
        delete globalThis.localStorage;
      } else {
        globalThis.localStorage = previous;
      }
    }
  }

  it('returns a stored supported locale', () => {
    withLocalStorage('"en"', () => {
      assert.equal(getInitialLocale(), 'en');
    });
  });

  it('falls back to zh-TW when the key is missing', () => {
    withLocalStorage(null, () => {
      assert.equal(getInitialLocale(), 'zh-TW');
    });
  });

  it('falls back to zh-TW when the stored locale is unsupported', () => {
    withLocalStorage('"fr"', () => {
      assert.equal(getInitialLocale(), 'zh-TW');
    });
  });

  it('falls back to zh-TW when stored JSON is corrupted', () => {
    withLocalStorage('{bad json', () => {
      assert.equal(getInitialLocale(), 'zh-TW');
    });
  });
});
