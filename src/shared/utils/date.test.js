import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, formatDateInTaipei, formatDateTime } from './date.js';

describe('formatDate / formatDateTime', () => {
  it('formats a valid date into a non-empty string', () => {
    assert.ok(formatDate('2026-06-13').length > 0);
    assert.ok(formatDateTime('2026-06-13T08:30:00Z').length > 0);
  });

  it('returns empty string for empty input', () => {
    assert.equal(formatDate(''), '');
    assert.equal(formatDate(null), '');
    assert.equal(formatDateTime(undefined), '');
  });

  it('returns empty string for unparseable dates', () => {
    assert.doesNotThrow(() => formatDate('not-a-date'));
    assert.equal(formatDate('not-a-date'), '');
    assert.equal(formatDateTime('garbage'), '');
  });
});

describe('formatDateInTaipei', () => {
  it('renders date-only in Asia/Taipei timezone', () => {
    assert.equal(
      formatDateInTaipei('2026-08-04T16:00:00Z', 'en'),
      '08/05/2026'
    );
  });

  it('returns empty string for missing or invalid input', () => {
    assert.equal(formatDateInTaipei(null), '');
    assert.equal(formatDateInTaipei('bad-date'), '');
  });
});
