import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { unwrapApiResponse, ApiResponseError } from './apiResponse.js';

describe('unwrapApiResponse', () => {
  it('returns data from successful ApiResponse envelopes', () => {
    const data = { activity: { id: 7 } };

    const result = unwrapApiResponse({ status: '200', data });

    assert.equal(result, data);
  });

  it('passes non-envelope responses through untouched', () => {
    const raw = { id: 1 };
    assert.equal(unwrapApiResponse(raw), raw);
    assert.equal(unwrapApiResponse(null), null);
  });

  it('throws an ApiResponseError carrying the backend status code', () => {
    try {
      unwrapApiResponse({ status: '403', message: 'notFriend' });
      assert.fail('expected unwrapApiResponse to throw');
    } catch (error) {
      assert.ok(error instanceof ApiResponseError);
      assert.equal(error.apiStatus, '403');
      assert.equal(error.message, 'notFriend');
    }
  });

  it('throws backend message from failed ApiResponse envelopes', () => {
    assert.throws(
      () => unwrapApiResponse({ status: '404', message: 'Activity order form not found' }),
      /Activity order form not found/
    );
  });

  it('falls back to the provided message when the error envelope has none', () => {
    try {
      unwrapApiResponse({ status: '500' }, 'boom');
      assert.fail('expected unwrapApiResponse to throw');
    } catch (error) {
      assert.ok(error instanceof ApiResponseError);
      assert.equal(error.apiStatus, '500');
      assert.equal(error.message, 'boom');
    }
  });
});
