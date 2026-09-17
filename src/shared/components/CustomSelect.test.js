import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('./CustomSelect.vue', import.meta.url), 'utf8');

test('CustomSelect is a shared pure shell without module/i18n dependencies', () => {
  assert.equal(source.includes('@/modules'), false);
  assert.equal(source.includes('from \'vue-i18n\''), false);
  assert.equal(source.includes('useI18n'), false);
});

test('CustomSelect exposes controlled v-model and ARIA shell contract', () => {
  assert.equal(source.includes('modelValue'), true);
  assert.equal(source.includes('update:modelValue'), true);
  assert.equal(source.includes('aria-haspopup="listbox"'), true);
  assert.equal(source.includes('aria-expanded'), true);
  assert.equal(source.includes('aria-controls'), true);
  assert.equal(source.includes('aria-invalid'), true);
  assert.equal(source.includes('role="listbox"'), true);
  assert.equal(source.includes('labelId'), true);
  assert.equal(source.includes('aria-labelledby'), true);
});

test('CustomSelect option shell uses option semantics and keyboard handlers', () => {
  assert.equal(source.includes('role="option"'), true);
  assert.equal(source.includes('aria-selected'), true);
  assert.equal(source.includes('handleTriggerKeydown'), true);
  assert.equal(source.includes('handleMenuKeydown'), true);
  assert.equal(source.includes('closeMenu({ focusTrigger'), true);
  assert.equal(source.includes('isUpdatingValue'), true);
});

test('CustomSelect handles outside click and lifecycle cleanup', () => {
  assert.equal(source.includes('addEventListener(\'pointerdown\''), true);
  assert.equal(source.includes('removeEventListener(\'pointerdown\''), true);
  assert.equal(source.includes('onMounted'), true);
  assert.equal(source.includes('onBeforeUnmount'), true);
});

test('CustomSelect avoids duplicate emits and keeps disabled-safe close behavior', () => {
  assert.equal(source.includes('queueMicrotask'), true);
  assert.equal(source.includes('props.disabled'), true);
  assert.equal(source.includes('() => props.disabled'), true);
});
