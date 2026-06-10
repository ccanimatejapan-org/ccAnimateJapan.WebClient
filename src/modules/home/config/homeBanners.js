import { ROUTE_NAMES } from '@/shared/constants/routes';
import bannerPlaceholder from '@/assets/images/banners/banner-placeholder.svg';

// 首頁主視覺輪播設定（圖片由營運提供）。
// 用法：把實際圖片放到 src/assets/images/banners/，在這裡 import 後填入 image。
// 每筆欄位：
//   image — 圖片（import 後的 URL）
//   alt   — 替代文字（無障礙）
//   to    — 點擊導向；可為站內 route 物件（如 { name, params }）或外連字串
// 空陣列時，首頁的 Banner 輪播區會自動隱藏。
export const homeBanners = [
  {
    image: bannerPlaceholder,
    alt: '東京角色祭 2026 預購開跑',
    to: { name: ROUTE_NAMES.ACTIVITY_PRODUCTS, params: { activityId: 1 } }
  }
];
