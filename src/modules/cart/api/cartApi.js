import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

export async function getCart() {
  const response = await httpClient.get('/cart');
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}

export async function addCartItem({ activityId, productId, quantity, note }) {
  const response = await httpClient.post('/cart/items', { activityId, productId, quantity, note });
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}

export async function updateCartItem(id, quantity) {
  const response = await httpClient.put(`/cart/items/${id}`, { quantity });
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}

export async function removeCartItem(id) {
  const response = await httpClient.delete(`/cart/items/${id}`);
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}
