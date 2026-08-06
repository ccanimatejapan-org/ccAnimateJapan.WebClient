import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isActivityOrderable } from './activityOrderable.js';

describe('isActivityOrderable', () => {
  it('returns true only when status is 3', () => {
    assert.equal(isActivityOrderable({ status: 3 }), true);
    assert.equal(isActivityOrderable({ status: '3' }), true);
    assert.equal(isActivityOrderable({ status: 4 }), false);
    assert.equal(isActivityOrderable({ status: 2 }), false);
    assert.equal(isActivityOrderable({ status: null }), false);
    assert.equal(isActivityOrderable({}), false);
    assert.equal(isActivityOrderable(), false);
  });

  it('returns false for invalid and non-numeric status', () => {
    assert.equal(isActivityOrderable({ status: 'ended' }), false);
    assert.equal(isActivityOrderable({ status: NaN }), false);
  });
});
