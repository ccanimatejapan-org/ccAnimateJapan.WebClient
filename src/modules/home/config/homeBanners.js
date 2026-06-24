import bannerCcDaigou from '@/assets/images/banners/banner-cc-daigou.jpg';

// 首頁主視覺輪播設定（圖片由營運提供，純展示、不可點擊）。
// 用法：把實際圖片放到 src/assets/images/banners/，在這裡 import 後填入 image。
// 每筆欄位：
//   image — 圖片（import 後的 URL）
//   alt   — 替代文字（無障礙）
// 空陣列時，首頁的 Banner 輪播區會自動隱藏。
export const homeBanners = [
  {
    image: bannerCcDaigou,
    alt: 'CC代購 角色周邊小舖'
  }
];
