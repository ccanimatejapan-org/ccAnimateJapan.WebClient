import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ADDRESS_MAX_LENGTH, ADDRESS_NAME_MAX_LENGTH, PHONE_MAX_LENGTH } from './inputLimits.js';

const read = (relativePath) => fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8');

// The <input> element that carries a given v-model.
const inputOf = (source, model) => {
  const match = source.match(new RegExp(`<input[^>]*v-model="${model.replace('.', '\\.')}"[^>]*>`, 's'));
  assert.ok(match, `input with v-model="${model}" not found`);
  return match[0];
};

test('free-text limits match the backend (WebAPI Application/Common/InputLimits.cs)', () => {
  assert.equal(ADDRESS_MAX_LENGTH, 200);
  assert.equal(ADDRESS_NAME_MAX_LENGTH, 60);
  assert.equal(PHONE_MAX_LENGTH, 20);
});

test('checkout: address, address label and recipient phone inputs are length-limited', () => {
  const source = read('../../modules/checkout/pages/CheckoutPage.vue');

  assert.ok(inputOf(source, 'newAddress').includes(':maxlength="ADDRESS_MAX_LENGTH"'));
  assert.ok(inputOf(source, 'newAddressName').includes(':maxlength="ADDRESS_NAME_MAX_LENGTH"'));
  assert.ok(inputOf(source, 'recipientPhone').includes(':maxlength="PHONE_MAX_LENGTH"'));
});

test('address book form: address and label inputs are length-limited', () => {
  const source = read('../../modules/member/components/AddressForm.vue');

  assert.ok(inputOf(source, 'form.address').includes(':maxlength="ADDRESS_MAX_LENGTH"'));
  assert.ok(inputOf(source, 'form.addressName').includes(':maxlength="ADDRESS_NAME_MAX_LENGTH"'));
});
