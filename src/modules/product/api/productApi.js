import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';
import { getActivities } from '@/modules/activity/api/activityApi';

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
  const result = await getActivityProductCatalog(activityId);
  return result.products;
}

export async function getActivityProductCatalog(activityId) {
  const normalizedActivityId = Number(activityId);

  const [productsResponse, activities] = await Promise.all([
    httpClient.get(`/activities/${normalizedActivityId}/products`),
    getActivities()
  ]);
  const products = unwrapApiResponse(productsResponse, 'product.loadFailed');
  const activityList = Array.isArray(activities) ? activities : [];

  return {
    activity: activityList.find((activity) => activity.id === normalizedActivityId) || null,
    products: normalizeActivityProducts(products, normalizedActivityId)
  };
}

export async function getProductById(id) {
  const response = await httpClient.get(`/products/${id}`);
  return unwrapApiResponse(response, 'product.notFound');
}
