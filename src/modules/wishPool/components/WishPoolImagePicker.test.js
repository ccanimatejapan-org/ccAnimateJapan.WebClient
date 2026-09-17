import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('./WishPoolImagePicker.vue', import.meta.url), 'utf8');

test('WishPool image picker keeps responsibility to UI/input events only', () => {
  assert.equal(source.includes('validateImageFile'), false);
  assert.equal(source.includes('buildWishPoolFormData'), false);
  assert.equal(source.includes('createObjectURL'), false);
  assert.equal(source.includes('revokeObjectURL'), false);
  assert.equal(source.includes(':accept="accept"'), true);
});

test('WishPool image picker renders dashed picker tile and preview/empty tile', () => {
  assert.equal(source.includes('<input') && source.includes('type="file"'), true);
  assert.equal(source.includes('wish-pool-image-picker__tiles'), true);
  assert.equal(source.includes('wish-pool-image-picker__picker'), true);
  assert.equal(source.includes('wish-pool-image-picker__preview'), true);
});

test('WishPool image picker can clear input via exposed method', () => {
  assert.equal(source.includes('defineExpose'), true);
  assert.equal(source.includes('clearInput'), true);
  assert.equal(source.includes('emit(\'file-change\''), true);
  assert.equal(source.includes('aria-describedby'), true);
  assert.equal(source.includes('aria-invalid'), true);
});

test('WishPool image picker supports disabled and error states', () => {
  assert.equal(source.includes('props.disabled'), true);
  assert.equal(source.includes('wish-pool-image-picker--error'), true);
  assert.equal(source.includes(':disabled="disabled"'), true);
});
