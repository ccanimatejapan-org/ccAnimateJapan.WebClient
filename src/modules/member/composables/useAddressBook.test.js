import test from 'node:test';
import assert from 'node:assert/strict';
import { useAddressBook } from './useAddressBook.js';

function deferred() { let resolve; const promise = new Promise((res) => { resolve = res; }); return { promise, resolve }; }

test('mutation lock prevents duplicate save/default/delete calls', async () => {
  const pending = deferred();
  let saves = 0;
  const book = useAddressBook({ getAddresses: async () => [], createAddress: async () => { saves += 1; return pending.promise; }, updateAddress: async () => {}, setDefaultAddress: async () => {}, deleteAddress: async () => {} });
  const first = book.save(null, {});
  const second = await book.save(null, {});
  assert.equal(second, false);
  assert.equal(saves, 1);
  pending.resolve();
  assert.equal(await first, true);
  assert.equal(book.isMutating.value, false);
});

test('successful write is reported as success even if the follow-up reload fails', async () => {
  let creates = 0;
  const book = useAddressBook({
    getAddresses: async () => { throw new Error('network'); },
    createAddress: async () => { creates += 1; },
    updateAddress: async () => {},
    setDefaultAddress: async () => {},
    deleteAddress: async () => {}
  });
  const result = await book.save(null, {});
  assert.equal(result, true);
  assert.equal(creates, 1);
  assert.equal(book.isMutating.value, false);
  assert.equal(book.error.value, null);
});

test('reload started before mutation cannot overwrite post-mutation reload', async () => {
  const oldReload = deferred();
  const newReload = deferred();
  let reads = 0;
  const book = useAddressBook({ getAddresses: () => (++reads === 1 ? oldReload.promise : newReload.promise), createAddress: async () => {}, updateAddress: async () => {}, setDefaultAddress: async () => {}, deleteAddress: async () => {} });
  const stale = book.reload();
  const mutation = book.makeDefault(2);
  newReload.resolve([{ id: 2, isDefault: true }]);
  await mutation;
  oldReload.resolve([{ id: 1, isDefault: false }]);
  await stale;
  assert.deepEqual(book.addresses.value, [{ id: 2, isDefault: true }]);
});
