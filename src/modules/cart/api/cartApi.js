import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';
import { shouldUseMockApi } from '@/shared/api/mockMode';

// In mock mode the cart lives entirely in the Pinia store / localStorage, so these
// helpers are not exercised; they return an empty server-shaped cart defensively.
const EMPTY_CART = { activityId: null, activityName: '', items: [] };

export async function getCart() {
  if (shouldUseMockApi()) {
    return Promise.resolve({ ...EMPTY_CART });
  }

  const response = await httpClient.get('/cart');
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}

export async function addCartItem({ activityId, productId, quantity, note }) {
  if (shouldUseMockApi()) {
    return Promise.resolve({ ...EMPTY_CART });
  }

  const response = await httpClient.post('/cart/items', { activityId, productId, quantity, note });
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}

export async function updateCartItem(id, quantity) {
  if (shouldUseMockApi()) {
    return Promise.resolve({ ...EMPTY_CART });
  }

  const response = await httpClient.put(`/cart/items/${id}`, { quantity });
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}

export async function removeCartItem(id) {
  if (shouldUseMockApi()) {
    return Promise.resolve({ ...EMPTY_CART });
  }

  const response = await httpClient.delete(`/cart/items/${id}`);
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}
