import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as features from './features.js';

describe('features（功能旗標）', () => {
  it('exports SHOW_LANGUAGE_SWITCHER', () => {
    assert.ok('SHOW_LANGUAGE_SWITCHER' in features);
  });

  it('every flag is a strict boolean so v-if cannot be fooled by a truthy string', () => {
    for (const [name, value] of Object.entries(features)) {
      assert.equal(typeof value, 'boolean', `${name} must be a boolean`);
    }
  });
});
