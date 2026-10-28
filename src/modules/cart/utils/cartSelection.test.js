import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatActivityIds,
  parseActivityIds,
  pickGroups,
  pruneSelection,
  selectableActivityIds,
  summarizeGroups,
  toggleActivityId
} from './cartSelection.js';

const groups = [
  { activityId: 8, activityOrderable: true, items: [{ id: 1 }, { id: 2 }], subtotal: 300, totalQuantity: 3 },
  { activityId: 11, activityOrderable: false, items: [{ id: 3 }], subtotal: 120, totalQuantity: 1 },
  { activityId: 15, activityOrderable: true, items: [{ id: 4 }], subtotal: 500, totalQuantity: 2 }
];

describe('parseActivityIds', () => {
  it('reads a comma separated query value', () => {
    assert.deepEqual(parseActivityIds('8,15'), [8, 15]);
  });

  it('accepts repeated query values', () => {
    assert.deepEqual(parseActivityIds(['8', '15,20']), [8, 15, 20]);
  });

  it('drops invalid, non-positive and duplicate ids', () => {
    assert.deepEqual(parseActivityIds('8,abc,,-1,0,1.5,8,15'), [8, 15]);
  });

  it('returns an empty list when the query is missing', () => {
    assert.deepEqual(parseActivityIds(undefined), []);
    assert.deepEqual(parseActivityIds(null), []);
    assert.deepEqual(parseActivityIds(''), []);
  });
});

describe('formatActivityIds', () => {
  it('joins ids for the checkout query', () => {
    assert.equal(formatActivityIds([8, 15]), '8,15');
  });
});

describe('toggleActivityId', () => {
  it('adds an id that is not selected', () => {
    assert.deepEqual(toggleActivityId([8], 15), [8, 15]);
  });

  it('removes an id that is selected', () => {
    assert.deepEqual(toggleActivityId([8, 15], 8), [15]);
  });
});

describe('selectableActivityIds', () => {
  it('lists only activities that can still be checked out', () => {
    assert.deepEqual(selectableActivityIds(groups), [8, 15]);
  });
});

describe('pruneSelection', () => {
  it('drops activities that are no longer in the cart', () => {
    assert.deepEqual(pruneSelection([8, 99, 15], groups), [8, 15]);
  });

  it('drops activities that can no longer be checked out', () => {
    assert.deepEqual(pruneSelection([8, 11], groups), [8]);
  });
});

describe('pickGroups', () => {
  it('returns the selected orderable groups in cart order', () => {
    assert.deepEqual(pickGroups(groups, [15, 8]).map((group) => group.activityId), [8, 15]);
  });

  it('never returns a group that cannot be checked out, even if asked', () => {
    assert.deepEqual(pickGroups(groups, [11]), []);
  });

  it('returns nothing when nothing is selected', () => {
    assert.deepEqual(pickGroups(groups, []), []);
  });
});

describe('summarizeGroups', () => {
  it('counts only the given groups', () => {
    assert.deepEqual(summarizeGroups([groups[0], groups[2]]), {
      activityCount: 2,
      totalQuantity: 5,
      subtotal: 800,
      items: [{ id: 1 }, { id: 2 }, { id: 4 }]
    });
  });

  it('is empty for no groups', () => {
    assert.deepEqual(summarizeGroups([]), { activityCount: 0, totalQuantity: 0, subtotal: 0, items: [] });
  });
});
