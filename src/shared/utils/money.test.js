import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatMoney } from './money.js';

describe('formatMoney', () => {
  it('formats a finite amount into a non-empty currency string', () => {
    const out = formatMoney(1200);
    assert.ok(typeof out === 'string' && out.length > 0);
    assert.ok(out.includes('1,200') || out.includes('1200'));
  });

  it('treats 0 as a valid price (free), not as missing data', () => {
    assert.ok(formatMoney(0).includes('0'));
  });

  it('returns empty string for non-finite input instead of NT$0', () => {
    assert.equal(formatMoney(NaN), '');
    assert.equal(formatMoney(undefined), '');
    assert.equal(formatMoney(null), '');
    assert.equal(formatMoney('abc'), '');
  });
});
