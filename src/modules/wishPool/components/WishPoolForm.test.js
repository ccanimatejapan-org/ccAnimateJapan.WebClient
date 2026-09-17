import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('./WishPoolForm.vue', import.meta.url), 'utf8');

test('WishPool form keeps existing validation, submit, and reset contract', () => {
  assert.equal(source.includes('validateWishPoolDraft'), true);
  assert.equal(source.includes('validateImageFile'), true);
  assert.equal(source.includes('emit(\'submit\''), true);
  assert.equal(source.includes('emit(\'cancel\''), true);
  assert.equal(source.includes('props.resetToken'), true);
  assert.equal(source.includes('watch(\n  () => props.resetToken'), true);
  assert.equal(source.includes('URL.revokeObjectURL'), true);
  assert.equal(source.includes('props.saving'), true);
});

test('WishPool form uses shared CustomSelect without label wrapping and supports loading states', () => {
  assert.equal(source.includes('CustomSelect'), true);
  assert.equal(source.includes('animateTypesLoading'), true);
  assert.equal(source.includes('animateTypesLoadFailed'), true);
  assert.equal(source.includes('retry-animate-types'), true);
  assert.equal(source.includes('wishPool.form.animateTypesLoadFailed'), true);
  assert.equal(source.includes('label-id="animateTypeLabelId"'), true);
  assert.equal(source.includes('description-id="animateTypeStateId"'), true);
  assert.equal(source.includes('for="animateTypeSelectId"'), true);
  assert.equal(source.includes('id="animateTypeSelectId"'), true);
});

test('WishPool form integration with picker is UI-only and saving-safe control contract', () => {
  assert.equal(source.includes('WishPoolImagePicker'), true);
  assert.equal(source.includes('imageErrorKey'), true);
  assert.equal(source.includes('draft.imageFile'), true);
  assert.equal(source.includes('imagePreview'), true);
  assert.equal(source.includes(':show-clear="Boolean(draft.imageFile)"'), true);
  assert.equal(source.includes(':disabled="saving"'), true);
  assert.equal(source.includes('imagePickerId'), true);
  assert.equal(source.includes('activityNameInputId'), true);
  assert.equal(source.includes('productUrlInputId'), true);
});
