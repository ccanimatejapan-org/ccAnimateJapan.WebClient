import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWishPoolFormData } from './wishPoolPayload.js';

test('wish pool payload uses the contract field names and trims boundary values', () => {
  const image = new File(['image'], 'cover.png', { type: 'image/png' });
  const payload = buildWishPoolFormData({
    animateTypeId: ' 42 ',
    activityName: '  想要的活動  ',
    productUrl: ' https://example.com/item ',
    imageFile: image
  });

  assert.deepEqual([...payload.entries()], [
    ['AnimateTypeId', '42'],
    ['ActivityName', '想要的活動'],
    ['ProductUrl', 'https://example.com/item'],
    ['ImageFile', image]
  ]);
});

test('wish pool payload omits ImageFile when no image is selected', () => {
  const payload = buildWishPoolFormData({ animateTypeId: 42, activityName: '活動', productUrl: '' });

  assert.deepEqual([...payload.entries()], [
    ['AnimateTypeId', '42'],
    ['ActivityName', '活動'],
    ['ProductUrl', '']
  ]);
  assert.equal(payload.has('ImageFile'), false);
});
