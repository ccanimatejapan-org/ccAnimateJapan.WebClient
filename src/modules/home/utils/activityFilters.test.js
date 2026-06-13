import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { filterByAvailability } from './activityFilters.js';

describe('filterByAvailability', () => {
  const activities = [
    { id: 1, isPreOrder: true },
    { id: 2, isPreOrder: false },
    { id: 3, isPreOrder: null }
  ];

  it('returns every activity for "all"', () => {
    assert.equal(filterByAvailability(activities, 'all').length, 3);
  });

  it('returns only pre-order activities for "preOrder"', () => {
    const result = filterByAvailability(activities, 'preOrder');
    assert.deepEqual(result.map((a) => a.id), [1]);
  });

  it('treats non-pre-order (false AND null) as in-stock, matching the card badge', () => {
    const result = filterByAvailability(activities, 'inStock');
    assert.deepEqual(result.map((a) => a.id), [2, 3]);
  });

  it('tolerates non-array input', () => {
    assert.deepEqual(filterByAvailability(null, 'all'), []);
    assert.deepEqual(filterByAvailability(undefined, 'inStock'), []);
  });
});
