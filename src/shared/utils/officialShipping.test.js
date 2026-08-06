import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getOfficialShippingDisplay } from './officialShipping.js';

function localTimeRange(start, end) {
  return getOfficialShippingDisplay({ isPreOrder: true, startTime: start, endTime: end }, 'en');
}

describe('getOfficialShippingDisplay', () => {
  it('returns hidden when not pre-order', () => {
    assert.equal(
      getOfficialShippingDisplay({ isPreOrder: false, startTime: '2026-08-01', endTime: '2026-08-10' }).status,
      'hidden'
    );
    assert.equal(
      getOfficialShippingDisplay({ isPreOrder: null, startTime: '2026-08-01', endTime: '2026-08-10' }).status,
      'hidden'
    );
  });

  it('returns pending when pre-order dates are missing', () => {
    assert.equal(localTimeRange(null, '2026-08-10').status, 'pending');
    assert.equal(localTimeRange('2026-08-04T00:00:00Z', null).status, 'pending');
    assert.equal(localTimeRange(undefined, '2026-08-07T00:00:00Z').status, 'pending');
    assert.equal(
      getOfficialShippingDisplay({ isPreOrder: true, startTime: 'bad-date', endTime: '2026-08-07T00:00:00Z' }).status,
      'pending'
    );
    assert.equal(
      getOfficialShippingDisplay({ isPreOrder: true, startTime: '2026-08-04T00:00:00Z', endTime: 'bad-date' }).status,
      'pending'
    );
  });

  it('returns ready with date range when pre-order and both dates are valid', () => {
    assert.equal(
      localTimeRange('2026-08-04T00:00:00Z', '2026-08-07T00:00:00Z').status,
      'ready'
    );
    assert.equal(localTimeRange('2026-08-04T00:00:00Z', '2026-08-07T00:00:00Z').range, '08/04/2026 - 08/07/2026');
  });

  it('returns hidden for non-pre-order regardless of provided dates', () => {
    assert.equal(
      getOfficialShippingDisplay({ isPreOrder: false, startTime: null, endTime: null }).status,
      'hidden'
    );
    assert.equal(
      getOfficialShippingDisplay({ isPreOrder: undefined, startTime: '2026-08-04', endTime: '2026-08-07' }).status,
      'hidden'
    );
  });

  it('uses Asia/Taipei fixed date-only formatting so cross-day does not depend on device timezone', () => {
    assert.equal(
      localTimeRange('2026-08-04T16:00:00Z', '2026-08-05T16:00:00Z').range,
      '08/05/2026 - 08/06/2026'
    );
  });
});
