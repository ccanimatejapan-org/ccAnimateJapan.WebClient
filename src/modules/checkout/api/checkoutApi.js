import { httpClient } from '@/shared/api/httpClient';

export async function createOrder(payload) {
  if (import.meta.env.DEV) {
    return Promise.resolve({
      orderNo: `CJ${Date.now()}`,
      ...payload
    });
  }

  return httpClient.post('/checkout/orders', payload);
}
