import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ref } from 'vue';
import { usePagination } from './usePagination.js';

describe('usePagination', () => {
  it('paginates items by page size', () => {
    const items = ref(Array.from({ length: 30 }, (_, i) => i));
    const { totalPages, pagedItems, setPage } = usePagination(items, 12);

    assert.equal(totalPages.value, 3);
    assert.equal(pagedItems.value.length, 12);

    setPage(3);
    assert.equal(pagedItems.value.length, 6);
  });

  it('clamps the current page when the list shrinks', () => {
    const items = ref(Array.from({ length: 30 }, (_, i) => i));
    const pager = usePagination(items, 12);

    pager.setPage(3);
    assert.equal(pager.page.value, 3);

    items.value = [1, 2, 3];

    assert.equal(pager.totalPages.value, 1);
    assert.equal(pager.page.value, 1);
    assert.equal(pager.pagedItems.value.length, 3);
  });
});
