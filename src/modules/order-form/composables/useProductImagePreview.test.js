import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useProductImagePreview } from './useProductImagePreview.js';

describe('useProductImagePreview', () => {
  it('opens preview with product image and name', () => {
    const preview = useProductImagePreview();

    preview.openImagePreview({ name: '掛毯', imageUrl: 'https://example.com/product.jpg' });

    assert.equal(preview.previewImage.value.imageUrl, 'https://example.com/product.jpg');
    assert.equal(preview.previewImage.value.name, '掛毯');
  });

  it('does not open preview for products without image', () => {
    const preview = useProductImagePreview();

    preview.openImagePreview({ name: '無圖商品', imageUrl: null });

    assert.equal(preview.previewImage.value, null);
  });

  it('closes preview', () => {
    const preview = useProductImagePreview();
    preview.openImagePreview({ name: '掛毯', imageUrl: 'https://example.com/product.jpg' });

    preview.closeImagePreview();

    assert.equal(preview.previewImage.value, null);
  });
});
