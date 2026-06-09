import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

export async function getOrders() {
  const response = await httpClient.get('/orders');
  return unwrapApiResponse(response, 'order.loadFailed');
}

export async function getOrderById(id) {
  const response = await httpClient.get(`/orders/${id}`);
  return unwrapApiResponse(response, 'order.notFound');
}

export async function createOrderFromCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('cart.toast.submitFailedMessage');
  }

  const activityIds = [...new Set(items.map((item) => Number(item.activityId)))];
  if (activityIds.length !== 1) {
    throw new Error('cart.toast.mixedActivityMessage');
  }

  const response = await httpClient.post('/orders', { items });
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}
