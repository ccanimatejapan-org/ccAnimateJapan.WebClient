import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canToggleReaction,
  getGroupBuyDecisionMeta,
  isValidProductUrl,
  MAX_PRODUCT_URL_LENGTH,
  validateImageFile,
  validateWishPoolDraft
} from './wishPoolRules.js';

test('wish pool form requires an anime and a trimmed activity name within 200 characters', () => {
  assert.deepEqual(validateWishPoolDraft({ animateTypeId: '  ', activityName: '  ' }), {
    animateTypeId: 'wishPool.validation.animateTypeRequired',
    activityName: 'wishPool.validation.activityNameRequired'
  });

  assert.equal(validateWishPoolDraft({ animateTypeId: 1, activityName: ` ${'a'.repeat(200)} ` }).activityName, undefined);
  assert.equal(validateWishPoolDraft({ animateTypeId: 1, activityName: 'a'.repeat(201) }).activityName, 'wishPool.validation.activityNameTooLong');
});

test('wish pool product URL is optional and only accepts http or https', () => {
  assert.equal(isValidProductUrl(''), true);
  assert.equal(isValidProductUrl('  '), true);
  assert.equal(isValidProductUrl('https://example.com/item'), true);
  assert.equal(isValidProductUrl('http://example.com/item'), true);
  assert.equal(isValidProductUrl(`https://example.com/${'a'.repeat(MAX_PRODUCT_URL_LENGTH - 'https://example.com/'.length)}`), true);
  assert.equal(isValidProductUrl(`https://example.com/${'a'.repeat(MAX_PRODUCT_URL_LENGTH - 'https://example.com/'.length + 1)}`), false);
  assert.equal(isValidProductUrl('javascript:alert(1)'), false);
  assert.equal(isValidProductUrl('ftp://example.com/item'), false);
  assert.equal(isValidProductUrl('not a URL'), false);
});

test('wish pool image validation enforces size and matching extension and MIME', () => {
  assert.deepEqual(validateImageFile(null), { valid: true, error: null });
  assert.equal(validateImageFile({ name: 'cover.jpg', type: 'image/jpeg', size: 0 }).error, 'wishPool.validation.imageEmpty');
  assert.deepEqual(validateImageFile({ name: 'cover.jpg', type: 'image/jpeg', size: 5 * 1024 * 1024 }), { valid: true, error: null });
  assert.equal(validateImageFile({ name: 'cover.png', type: 'image/png', size: 5 * 1024 * 1024 + 1 }).error, 'wishPool.validation.imageTooLarge');
  assert.equal(validateImageFile({ name: 'cover.exe', type: 'application/octet-stream', size: 10 }).error, 'wishPool.validation.imageTypeInvalid');
  assert.equal(validateImageFile({ name: 'cover.jpg', type: 'image/png', size: 10 }).error, 'wishPool.validation.imageTypeInvalid');
  assert.equal(validateImageFile({ name: 'cover.webp', type: 'image/webp', size: 10 }).valid, true);
  assert.equal(validateImageFile({ name: 'cover.gif', type: 'image/gif', size: 10 }).valid, true);
});

test('group buy decisions map to stable i18n keys and variants', () => {
  assert.deepEqual(getGroupBuyDecisionMeta('Pending'), { key: 'wishPool.decision.pending', variant: 'pending' });
  assert.deepEqual(getGroupBuyDecisionMeta('Opened'), { key: 'wishPool.decision.opened', variant: 'opened' });
  assert.deepEqual(getGroupBuyDecisionMeta('NotOpened'), { key: 'wishPool.decision.notOpened', variant: 'not-opened' });
  assert.deepEqual(getGroupBuyDecisionMeta('unexpected'), { key: 'wishPool.decision.unknown', variant: 'unknown' });
});

test('reaction can only be toggled when API allows it and the item is not pending', () => {
  assert.equal(canToggleReaction({ canReact: true }, false), true);
  assert.equal(canToggleReaction({ canReact: true }, true), false);
  assert.equal(canToggleReaction({ canReact: false }, false), false);
  assert.equal(canToggleReaction(null, false), false);
});
