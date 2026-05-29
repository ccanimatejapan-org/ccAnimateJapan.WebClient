import { ref } from 'vue';

export function useProductImagePreview() {
  const previewImage = ref(null);

  function openImagePreview(product) {
    if (!product?.imageUrl) return;

    previewImage.value = {
      imageUrl: product.imageUrl,
      name: product.name || ''
    };
  }

  function closeImagePreview() {
    previewImage.value = null;
  }

  return {
    previewImage,
    openImagePreview,
    closeImagePreview
  };
}
