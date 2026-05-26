import { ORDER_STATUS } from '@/shared/constants/orderStatus';
import { httpClient } from '@/shared/api/httpClient';

const mockOrders = [
  {
    id: 101,
    orderStatus: ORDER_STATUS.CUSTOMER_PAID,
    paymentStatus: 2,
    deliveryStatus: 1,
    total: 2200,
    createdAt: '2026-05-25T08:30:00+08:00'
  },
  {
    id: 102,
    orderStatus: ORDER_STATUS.SHIPPED_TO_CUSTOMER,
    paymentStatus: 2,
    deliveryStatus: 3,
    total: 980,
    createdAt: '2026-05-24T14:10:00+08:00'
  }
];

export async function getOrders() {
  if (import.meta.env.DEV) {
    return Promise.resolve(mockOrders);
  }

  return httpClient.get('/orders');
}

export async function getOrderById(id) {
  if (import.meta.env.DEV) {
    return Promise.resolve(mockOrders.find((order) => order.id === Number(id)));
  }

  return httpClient.get(`/orders/${id}`);
}
