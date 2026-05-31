import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';
import { shouldUseMockApi } from '@/shared/api/mockMode';

export async function getActivities(params = {}) {
  if (shouldUseMockApi()) {
    return Promise.resolve(createMockActivities(params));
  }

  const response = await httpClient.get('/activities', { params });
  return unwrapApiResponse(response, 'activity.loadFailed');
}

export async function getActivityById(id) {
  if (shouldUseMockApi()) {
    return Promise.resolve(
      createMockActivities().find((activity) => activity.id === Number(id)) || null
    );
  }

  const response = await httpClient.get(`/activities/${id}/order-form`);
  return unwrapApiResponse(response, 'activity.notFound')?.activity || null;
}

export function createMockActivities(params = {}) {
  const activities = [
    {
      id: 1,
      name: '東京角色祭 2026',
      slug: 'tokyo-character-fes-2026',
      imageUrl:
        'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&q=80',
      activeStartTime: '2026-06-12T10:00:00+08:00',
      activeEndTime: '2026-06-25T23:59:00+08:00',
      address: '線上預購 / 台北快閃取貨',
      info: '模型、立牌與限定收藏套組同步開放登記，適合從 LINE 官方帳號快速下單。',
      isPreOrder: true
    },
    {
      id: 2,
      name: '夏日動漫周邊展',
      slug: 'summer-anime-goods',
      imageUrl:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
      activeStartTime: '2026-07-01T12:00:00+08:00',
      activeEndTime: '2026-07-14T23:59:00+08:00',
      address: '台北地下街門市 / 線上加購',
      info: '壓克力、徽章、鑰匙圈與小物補貨活動，數量有限售完為止。',
      isPreOrder: false
    },
    {
      id: 3,
      name: '插畫設定集預約會',
      slug: 'art-book-reservation',
      imageUrl:
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
      activeStartTime: '2026-07-20T09:00:00+08:00',
      activeEndTime: '2026-08-05T23:59:00+08:00',
      address: '線上限定',
      info: '設定集、原畫冊與特典海報預約，送出後會由工作人員確認到貨批次。',
      isPreOrder: true
    },
    {
      id: 4,
      name: '週末現貨補貨場',
      slug: 'weekend-restock',
      imageUrl:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
      activeStartTime: '2026-08-09T11:00:00+08:00',
      activeEndTime: '2026-08-11T20:00:00+08:00',
      address: '門市現貨 / 宅配',
      info: '熱門角色小物與少量現貨回補，購物車送出後會保留品項等待付款通知。',
      isPreOrder: false
    }
  ];

  const limit = Number(params.limit);
  if (Number.isFinite(limit) && limit > 0) {
    return activities.slice(0, limit);
  }

  return activities;
}
