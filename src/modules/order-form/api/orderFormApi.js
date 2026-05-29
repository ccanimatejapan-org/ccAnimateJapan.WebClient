const mockActivities = [
  {
    id: 1,
    name: '東京動漫展預購活動',
    activeStartTime: '2026-06-01T10:00:00+08:00',
    activeEndTime: '2026-06-03T18:00:00+08:00',
    isDelete: false,
    createdAdminId: 1,
    createdAt: '2026-05-01T10:00:00+08:00',
    updatedAt: null,
    address: '東京 Big Sight',
    animateTypeId: 1,
    activityTypeId: 1,
    prepareStartTime: '2026-05-20T10:00:00+08:00',
    prepareEndTime: '2026-05-31T18:00:00+08:00',
    info: '請確認商品、數量與聯絡資訊。送出後工作人員會依序確認訂單。',
    updateAdminId: null,
    imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=1200&q=80',
    status: 1,
    isPreOrder: true
  },
  {
    id: 2,
    name: '大阪限定周邊代購',
    activeStartTime: '2026-07-12T11:00:00+08:00',
    activeEndTime: '2026-07-14T19:00:00+08:00',
    isDelete: false,
    createdAdminId: 1,
    createdAt: '2026-05-12T10:00:00+08:00',
    updatedAt: null,
    address: '大阪 Intex Osaka',
    animateTypeId: 2,
    activityTypeId: 1,
    prepareStartTime: '2026-07-01T10:00:00+08:00',
    prepareEndTime: '2026-07-10T18:00:00+08:00',
    info: '此活動商品數量有限，送出表單不代表保證成立，請等待確認通知。',
    updateAdminId: null,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    status: 1,
    isPreOrder: true
  }
];

const mockProducts = [
  {
    id: 1,
    created_at: '2026-05-01T10:00:00+08:00',
    createAdminId: 1,
    updateAt: null,
    updateAdminId: null,
    name: '限定模型套組',
    japanCost: 5200,
    rate: 0.22,
    price: 1680,
    amount: 12,
    isDelete: false,
    isOutStock: false,
    productTypeId: 1,
    activityId: 1,
    info: '含特典明信片。',
    imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    created_at: '2026-05-01T10:00:00+08:00',
    createAdminId: 1,
    updateAt: null,
    updateAdminId: null,
    name: '櫻花壓克力立牌',
    japanCost: 1500,
    rate: 0.22,
    price: 520,
    amount: 30,
    isDelete: false,
    isOutStock: false,
    productTypeId: 2,
    activityId: 1,
    info: '約 15 公分高。',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    created_at: '2026-05-12T10:00:00+08:00',
    createAdminId: 1,
    updateAt: null,
    updateAdminId: null,
    name: '大阪會場限定鑰匙圈',
    japanCost: 900,
    rate: 0.22,
    price: 260,
    amount: 42,
    isDelete: false,
    isOutStock: false,
    productTypeId: 2,
    activityId: 2,
    info: '隨機角色款。',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80'
  }
];

export async function getOrderForm(activityId) {
  const numericActivityId = Number(activityId);
  const activity = mockActivities.find(
    (entry) => entry.id === numericActivityId && entry.isDelete !== true
  );

  if (!activity) {
    throw new Error('orderForm.errors.formNotFound');
  }

  const products = mockProducts.filter(
    (product) =>
      product.activityId === numericActivityId &&
      product.isDelete !== true &&
      product.isOutStock !== true
  );

  return Promise.resolve({
    activity,
    agreement: {
      titleKey: 'orderForm.agreement.title',
      contentKeys: [
        'orderForm.agreement.ruleContact',
        'orderForm.agreement.ruleConfirmation',
        'orderForm.agreement.ruleZeroQuantity'
      ]
    },
    products
  });
}

export async function submitMockOrder(payload) {
  const createdAt = new Date().toISOString();

  return Promise.resolve({
    id: Date.now(),
    subscriberName: payload.subscriberName,
    subscriberEmail: payload.subscriberEmail,
    subscriberPhone: payload.subscriberPhone || null,
    createdAt,
    createdAdminId: null,
    updateAt: null,
    updateAdminId: null,
    deliveryTypeId: null,
    activityId: payload.activityId,
    total: payload.total,
    orderStatus: 1,
    paymentStatus: 1,
    deliveryStatus: 1,
    orderProducts: payload.items.map((item) => ({
      id: `${Date.now()}-${item.productId}`,
      orderId: null,
      productId: item.productId,
      amount: item.amount,
      createdAt,
      createdAdminId: null,
      updateAt: null,
      updateAdminId: null,
      subTotal: item.subTotal,
      price: item.price,
      info: item.info || null,
      orderProductStatus: 1
    }))
  });
}
