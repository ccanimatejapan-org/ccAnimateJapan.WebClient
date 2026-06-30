import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

function normalizeActivityProducts(products, activityId) {
  if (!Array.isArray(products)) return [];

  return products
    .filter((product) => product?.id != null)
    .map((product) => {
      const stock = Number(product.stock ?? product.amount);
      const info = product.info ?? product.note ?? '';

      const rawImageUrls = Array.isArray(product.imageUrls) ? product.imageUrls : [];
      const imageUrls = rawImageUrls
        .filter((url) => typeof url === 'string' && url.trim())
        .map((url) => url.trim());
      const imageUrl = product.imageUrl || imageUrls[0] || '';
      const normalizedImageUrls = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];

      return {
        ...product,
        activityId: Number(product.activityId ?? activityId),
        productTypeName: product.productTypeName || '',
        stock: Number.isFinite(stock) ? stock : null,
        note: product.note ?? info,
        description: product.description ?? info,
        imageUrl,
        imageUrls: normalizedImageUrls
      };
    });
}

export async function getProductsByActivity(activityId, params = {}) {
  const normalizedActivityId = Number(activityId);
  const response = await httpClient.get(`/activities/${normalizedActivityId}/products`, { params });
  const data = unwrapApiResponse(response, 'product.loadFailed');

  if (Array.isArray(data)) {
    return normalizeActivityProducts(data, normalizedActivityId);
  }

  return {
    ...data,
    items: normalizeActivityProducts(data?.items, normalizedActivityId)
  };
}
