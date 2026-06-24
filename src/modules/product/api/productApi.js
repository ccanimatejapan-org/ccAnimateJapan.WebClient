import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

function normalizeActivityProducts(products, activityId) {
  if (!Array.isArray(products)) return [];

  return products
    .filter((product) => product?.id != null)
    .map((product) => {
      const stock = Number(product.stock ?? product.amount);
      const info = product.info ?? product.note ?? '';

      return {
        ...product,
        activityId: Number(product.activityId ?? activityId),
        category: product.category || '',
        stock: Number.isFinite(stock) ? stock : null,
        note: product.note ?? info,
        description: product.description ?? info
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
