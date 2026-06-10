import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

// TODO(暫時): 後端 GET /activities 補上 animateTypeId / animateTypeName / orderCount 後，
// 移除 VITE_ACTIVITY_USE_MOCK 分支與 createMockActivities()，改回只打真實 API。
// 預設 false（正式環境＝真實 API，首頁「依作品逛」與「熱門活動」會在資料缺欄位時自動隱藏）；
// 本地 .env.local 設 true 即可用假資料看完整改版首頁。
const USE_ACTIVITY_MOCK = import.meta.env.VITE_ACTIVITY_USE_MOCK === 'true';

export async function getActivities(params = {}) {
  if (USE_ACTIVITY_MOCK) {
    return createMockActivities(params);
  }

  const response = await httpClient.get('/activities', { params });
  return unwrapApiResponse(response, 'activity.loadFailed');
}

function createMockActivities(params = {}) {
  // animateTypeId / animateTypeName 對映 DB animateType 表（排球少年=7、我的英雄學院=2、咒術迴戰=5、進擊的巨人=3）。
  // real 模式的活動目前尚無這兩欄，首頁「依作品逛」會自動隱藏，待後端補欄位即點亮。
  const activities = [
    {
      id: 1,
      name: '東京角色祭 2026',
      slug: 'tokyo-character-fes-2026',
      orderCount: 320,
      animateTypeId: 7,
      animateTypeName: '排球少年',
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
      orderCount: 210,
      animateTypeId: 2,
      animateTypeName: '我的英雄學院',
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
      orderCount: 150,
      animateTypeId: 5,
      animateTypeName: '咒術迴戰',
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
      orderCount: 95,
      animateTypeId: 3,
      animateTypeName: '進擊的巨人',
      imageUrl:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
      activeStartTime: '2026-08-09T11:00:00+08:00',
      activeEndTime: '2026-08-11T20:00:00+08:00',
      address: '門市現貨 / 宅配',
      info: '熱門角色小物與少量現貨回補，購物車送出後會保留品項等待付款通知。',
      isPreOrder: false
    },
    {
      id: 5,
      name: '排球少年 寒假限定場',
      slug: 'haikyu-winter',
      orderCount: 260,
      animateTypeId: 7,
      animateTypeName: '排球少年',
      imageUrl:
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      activeStartTime: '2026-01-15T10:00:00+08:00',
      activeEndTime: '2026-02-05T23:59:00+08:00',
      address: '線上預購',
      info: '寒假限定角色組與比賽主題周邊，採預購方式登記。',
      isPreOrder: true
    },
    {
      id: 6,
      name: '我的英雄學院 設定資料集',
      slug: 'mha-artbook',
      orderCount: 180,
      animateTypeId: 2,
      animateTypeName: '我的英雄學院',
      imageUrl:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
      activeStartTime: '2026-09-01T10:00:00+08:00',
      activeEndTime: '2026-09-20T23:59:00+08:00',
      address: '線上限定',
      info: '官方設定資料集與原畫海報預約，附特典明信片。',
      isPreOrder: true
    }
  ];

  const limit = Number(params.limit);
  if (Number.isFinite(limit) && limit > 0) {
    return activities.slice(0, limit);
  }

  return activities;
}
