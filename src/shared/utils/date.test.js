import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, formatDateTime } from './date.js';

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
