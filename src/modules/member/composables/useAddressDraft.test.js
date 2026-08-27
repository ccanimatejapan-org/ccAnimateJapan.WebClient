import test from 'node:test';
import assert from 'node:assert/strict';
import { useAddressDraft } from './useAddressDraft.js';

test('submit payload does not clear the draft and successful reset keeps delivery type', () => {
  const draft = useAddressDraft(null, 7);
  draft.form.addressName = '家';
  draft.form.address = '台北市';
  draft.form.isDefault = true;
  assert.deepEqual(draft.toPayload(), { deliveryTypeId: 7, addressName: '家', address: '台北市', isDefault: true });
  assert.equal(draft.form.address, '台北市');
  draft.resetAfterSuccess();
  assert.equal(draft.form.deliveryTypeId, 7);
  assert.equal(draft.form.address, '');
  assert.equal(draft.form.addressName, '');
  assert.equal(draft.form.isDefault, false);
});
