import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

export async function getOrders(params = {}) {
  const response = await httpClient.get('/orders', { params });
  return unwrapApiResponse(response, 'order.loadFailed');
}

export async function getOrderById(id) {
  const response = await httpClient.get(`/orders/${id}`);
  return unwrapApiResponse(response, 'order.notFound');
}

export async function createOrderFromCartItems(items, shipping = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('cart.toast.submitFailedMessage');
  }

  const checkoutItems = items.map((item) => ({
    cartItemId: Number(item?.id),
    quantity: Number(item?.quantity)
  }));

  if (checkoutItems.some((item) => !Number.isInteger(item.cartItemId) || item.cartItemId <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    throw new Error('cart.toast.submitFailedMessage');
  }

  const payload = {
    items: checkoutItems,
    deliveryTypeId: shipping.deliveryTypeId ?? null,
    addressId: shipping.addressId ?? null,
    saveAddress: Boolean(shipping.saveAddress),
    addressName: shipping.addressName ?? null,
    address: shipping.address ?? null,
    recipientPhone: shipping.recipientPhone ?? null
  };

  const response = await httpClient.post('/orders', payload);
  return unwrapApiResponse(response, 'cart.toast.submitFailedMessage');
}
