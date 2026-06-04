import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';
import { shouldUseMockApi } from '@/shared/api/mockMode';
import { createMockActivities, getActivities } from '@/modules/activity/api/activityApi';

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
  if (shouldUseMockApi()) {
    return Promise.resolve(createMockProducts(params));
  }

  const response = await httpClient.get('/products', { params });
  return unwrapApiResponse(response, 'product.loadFailed');
}

export async function getProductsByActivity(activityId) {
  const result = await getActivityProductCatalog(activityId);
  return result.products;
}

export async function getActivityProductCatalog(activityId) {
  const normalizedActivityId = Number(activityId);

  if (shouldUseMockApi()) {
    return Promise.resolve({
      activity:
        createMockActivities().find((activity) => activity.id === normalizedActivityId) || null,
      products: createMockProducts({ activityId: normalizedActivityId })
    });
  }

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
  if (shouldUseMockApi()) {
    return Promise.resolve(createMockProducts().find((product) => product.id === Number(id)) || null);
  }

  const response = await httpClient.get(`/products/${id}`);
  return unwrapApiResponse(response, 'product.notFound');
}

export function createMockProducts(params = {}) {
  const products = [
    {
      id: 101,
      activityId: 1,
      name: '東京角色祭限定模型套組',
      category: 'figure',
      price: 1680,
      stock: 12,
      featured: true,
      imageUrl:
        'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=900&q=80',
      note: '含限定外盒，可備註希望角色排序。',
      description: 'Collector figure set with limited edition packaging.'
    },
    {
      id: 102,
      activityId: 1,
      name: '主視覺壓克力立牌',
      category: 'goods',
      price: 520,
      stock: 34,
      featured: true,
      imageUrl:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80',
      note: '桌面展示款，可於備註填角色名稱。',
      description: 'Desktop acrylic stand for seasonal display.'
    },
    {
      id: 103,
      activityId: 1,
      name: '會場限定徽章組',
      category: 'goods',
      price: 360,
      stock: 24,
      featured: false,
      imageUrl:
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
      note: '一組 3 入，圖樣隨機出貨。',
      description: 'Limited event badge set.'
    },
    {
      id: 201,
      activityId: 2,
      name: '夏日祭典鑰匙圈',
      category: 'goods',
      price: 280,
      stock: 42,
      featured: true,
      imageUrl:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
      note: '現貨補貨，售完不追加。',
      description: 'Compact keychain with durable metal clasp.'
    },
    {
      id: 202,
      activityId: 2,
      name: '角色透明貼紙包',
      category: 'goods',
      price: 180,
      stock: 60,
      featured: false,
      imageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      note: '每包 8 張，適合手帳與手機殼。',
      description: 'Transparent sticker pack.'
    },
    {
      id: 203,
      activityId: 2,
      name: '迷你角色托特包',
      category: 'goods',
      price: 640,
      stock: 18,
      featured: true,
      imageUrl:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
      note: '帆布材質，備註可填偏好色。',
      description: 'Mini tote bag with character print.'
    },
    {
      id: 301,
      activityId: 3,
      name: '動畫設定資料集',
      category: 'book',
      price: 980,
      stock: 0,
      featured: true,
      imageUrl:
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
      note: '預約商品，預計 9 月到貨。',
      description: 'Premium art collection with character sketches.'
    },
    {
      id: 302,
      activityId: 3,
      name: '原畫明信片套組',
      category: 'goods',
      price: 420,
      stock: 0,
      featured: false,
      imageUrl:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
      note: '含 6 張明信片與收納紙套。',
      description: 'Postcard collection.'
    },
    {
      id: 401,
      activityId: 4,
      name: '週末現貨福袋',
      category: 'goods',
      price: 799,
      stock: 16,
      featured: true,
      imageUrl:
        'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80',
      note: '隨機組合，不接受指定內容。',
      description: 'Weekend restock lucky bag.'
    },
    {
      id: 402,
      activityId: 4,
      name: '展示盒收藏保護套',
      category: 'figure',
      price: 350,
      stock: 20,
      featured: false,
      imageUrl:
        'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=900&q=80',
      note: '適合小型模型與徽章收藏。',
      description: 'Display case cover.'
    }
  ];

  const activityId = Number(params.activityId);
  if (Number.isFinite(activityId) && activityId > 0) {
    return products.filter((product) => product.activityId === activityId);
  }

  return products;
}
