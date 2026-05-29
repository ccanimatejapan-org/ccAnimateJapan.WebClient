import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { unwrapApiResponse } from './apiResponse.js';

describe('unwrapApiResponse', () => {
  it('returns data from successful ApiResponse envelopes', () => {
    const data = { activity: { id: 7 } };

    const result = unwrapApiResponse({ status: '200', data });

    assert.equal(result, data);
  });

  it('throws backend message from failed ApiResponse envelopes', () => {
    assert.throws(
      () => unwrapApiResponse({ status: '404', message: 'Activity order form not found' }),
      /Activity order form not found/
    );
  });
});
