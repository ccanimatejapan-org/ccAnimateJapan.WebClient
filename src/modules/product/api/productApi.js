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

export async function getProducts(params = {}) {
  const response = await httpClient.get('/products', { params });
  return unwrapApiResponse(response, 'product.loadFailed');
}

export async function getProductsByActivity(activityId) {
  const normalizedActivityId = Number(activityId);
  const response = await httpClient.get(`/activities/${normalizedActivityId}/products`);
  const products = unwrapApiResponse(response, 'product.loadFailed');
  return normalizeActivityProducts(products, normalizedActivityId);
}

export async function getProductById(id) {
  const response = await httpClient.get(`/products/${id}`);
  return unwrapApiResponse(response, 'product.notFound');
}
