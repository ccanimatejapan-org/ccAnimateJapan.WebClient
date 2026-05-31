import { ORDER_STATUS } from '@/shared/constants/orderStatus';
import { httpClient } from '@/shared/api/httpClient';
import { getStorageItem, setStorageItem } from '@/shared/utils/storage';

const MOCK_ORDER_STORAGE_KEY = 'ccAnimateJapan.mockOrders';

const mockOrders = [
  {
    id: 101,
    orderNo: 'CJ20260525001',
    activityId: 1,
    activityName: '東京角色祭 2026',
    orderStatus: ORDER_STATUS.CUSTOMER_PAID,
    paymentStatus: 'paid',
    total: 2200,
    createdAt: '2026-05-25T08:30:00+08:00',
    items: [
      {
        productId: 101,
        productName: '東京角色祭限定模型套組',
        price: 1680,
        quantity: 1,
        note: ''
      },
      {
        productId: 102,
        productName: '主視覺壓克力立牌',
        price: 520,
        quantity: 1,
        note: '角色 A'
      }
    ]
  },
  {
    id: 102,
    orderNo: 'CJ20260524001',
    activityId: 2,
    activityName: '夏日動漫周邊展',
    orderStatus: ORDER_STATUS.SHIPPED_TO_CUSTOMER,
    paymentStatus: 'paid',
    total: 920,
    createdAt: '2026-05-24T14:10:00+08:00',
    items: [
      {
        productId: 203,
        productName: '迷你角色托特包',
        price: 640,
        quantity: 1,
        note: ''
      },
      {
        productId: 201,
        productName: '夏日祭典鑰匙圈',
        price: 280,
        quantity: 1,
        note: ''
      }
    ]
  }
];

function getStoredOrders() {
  return getStorageItem(MOCK_ORDER_STORAGE_KEY, []);
}

function setStoredOrders(orders) {
  setStorageItem(MOCK_ORDER_STORAGE_KEY, orders);
}

function getMockOrders() {
  return [...getStoredOrders(), ...mockOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrders() {
  if (import.meta.env.DEV) {
    return Promise.resolve(getMockOrders());
  }

  return httpClient.get('/orders');
}

export async function getOrderById(id) {
  if (import.meta.env.DEV) {
    return Promise.resolve(getMockOrders().find((order) => Number(order.id) === Number(id)) || null);
  }

  return httpClient.get(`/orders/${id}`);
}

export async function createOrderFromCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('cart.toast.submitFailedMessage');
  }

  const activityIds = [...new Set(items.map((item) => Number(item.activityId)))];
  if (activityIds.length !== 1) {
    throw new Error('cart.toast.mixedActivityMessage');
  }

  if (!import.meta.env.DEV) {
    return httpClient.post('/orders', { items });
  }

  const createdAt = new Date().toISOString();
  const id = Date.now();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id,
    orderNo: `CJ${new Date().toISOString().slice(0, 10).replaceAll('-', '')}${String(id).slice(-4)}`,
    activityId: activityIds[0],
    activityName: items[0].activityName,
    orderStatus: ORDER_STATUS.CUSTOMER_ORDERED,
    paymentStatus: 'unpaid',
    total,
    createdAt,
    items: items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: item.quantity,
      note: item.note
    }))
  };

  setStoredOrders([order, ...getStoredOrders()]);
  return Promise.resolve(order);
}
