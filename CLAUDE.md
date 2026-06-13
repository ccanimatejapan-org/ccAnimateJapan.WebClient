# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 本文件以繁體中文為主，協助 Claude Code 以及新加入的開發者快速了解專案。

## 專案概述

ccAnimateJapan 的前台商城，技術棧為 **Vue 3（Composition API）+ Vite + Pinia**，主要使用情境是手機瀏覽器、LINE 官方帳號與 LIFF WebView。

資料一律來自正式後端 `ccAnimateJapan.WebAPI`（活動/商品/購物車/訂單），**已移除所有 mock/假資料切換**，前端永遠打真 API。**LINE 登入為必要流程**（需登入＋加官方好友才能進商城）。

`ARCHITECTURE.md`（繁體中文）是專案最完整、最權威的說明，涵蓋資料夾責任、資料流、頁面路由與所有規範。**做任何結構性調整前請先閱讀它。** 本文件只補充那些「光看 `ARCHITECTURE.md` 或檔案結構不容易看出來」的重點。

## 工作流程規範（重要）

- **每次修改完成後都要做 code review**（由 Claude 進行，可使用 `/code-review`），再進入下一個變更。
- **工具分工**：
  - **規劃**：由 Claude 負責（分析需求、設計實作策略、拆解步驟）。
  - **實作開發**：由 Codex 負責（依規劃撰寫程式與測試）。
  - **Code review**：由 Claude 負責。
- **不要自動 commit**：所有調整完成後，僅將變更留在工作目錄（unstaged）即可，
  不要執行 `git add` / `git commit` / `git push`。由使用者自行做最後檢查後再 commit、push。

## 常用指令

```bash
npm run dev        # 啟動 Vite dev server（host 0.0.0.0，會把 /api proxy 到 VITE_API_PROXY_TARGET，預設 http://localhost:5222）
npm run build      # 建置正式檔案到 dist/
npm run preview    # 預覽 build 產物

node --test                                  # 執行所有 *.test.js
node --test src/shared/api/apiResponse.test.js   # 執行單一測試檔
```

注意：`package.json` 沒有 test script，也沒有安裝測試框架。測試是用 Node 內建的 `node:test` + `node:assert/strict` 撰寫，直接以 `node --test` 執行。目前**沒有 lint 指令**。

## 重要慣例

- **路徑別名**：`@` → `src`（同時設定在 `vite.config.js` 與 `jsconfig.json`，兩處要保持一致）。
- **模組結構**：功能放在 `src/modules/{feature}/`，各自擁有 `pages/ components/ api/ stores/ composables/ utils/ styles/ routes.js`。`src/shared/` 放跨模組共用程式，**不可以 import `src/modules/` 內的東西**；模組之間也盡量不要互相 import，有共用需求請抽到 `src/shared/`。
- **路由**：route name 集中在 `src/shared/constants/routes.js` 的 `ROUTE_NAMES`，各模組 `routes.js` 只引用、不硬寫字串。`src/router/index.js` 把模組路由分組到 `DefaultLayout` / `AuthLayout`。新增路由流程：先補 route name → 補模組 route → 再到 `src/router/index.js` 掛進正確的 layout group。
- **i18n**：每個畫面文字都要**同時**補上 `src/locales/zh-TW.json`（預設語系）與 `src/locales/en.json`（fallback）的 key。
- **測試 colocate**：測試檔以 `*.test.js` 命名，放在來源檔旁邊。純函式 / 業務規則（例如 `quantityPolicy.js`）優先補測試。

## API 寫法

各 API 檔（`src/modules/*/api/*.js`）直接呼叫 `httpClient` 並經過 `unwrapApiResponse()` 處理。**已移除所有 mock 分支與 `mockMode.js`**，不要再加回假資料切換。

- 所有 HTTP 都走 `httpClient`（`src/shared/api/httpClient.js`），其 response interceptor 已經回傳 `response.data`。後端包裝格式 `{ status, data, message }` 由 `unwrapApiResponse()` 解開，`status !== '200'` 時會丟出錯誤。新增 endpoint 時沿用此結構即可。
- 購物車由 `cartStore` 透過 `src/modules/cart/api/cartApi.js` 與後端同步（**伺服器為準**，覆蓋本地）；訂單走 `orderApi`（`POST /orders`）。登入後 `httpClient` request interceptor 會自動帶 `Authorization: Bearer`（見下方 LINE 登入）。

## MVP 範圍注意事項（依 ARCHITECTURE.md）

- 結帳流程：`CartPage` 的「前往結帳」導向 `/checkout`（`modules/checkout`）→ 選物流方式 + 收件地址（依 `deliveryTypes.addressKind`：1 宅配地址 / 2 超商門市 / 3 免地址）→ `createOrderFromCartItems(items, shipping)` 打 `POST /orders` 建訂單（後端清空伺服器購物車並寫入收件快照）後導向 `/orders`。結帳前會檢查會員 email/姓名/電話，未填則導去會員資料頁補齊。
- 購物車一次只允許同一個活動的商品。
- 沒有商品詳情 route；`/products` 會 redirect 回首頁。`ProductDetailPage.vue`、`ProductFilter.vue`、`ProductImageGallery.vue` 是保留但未使用的檔案。
- 舊的 `modules/order-form`（`/activity/:activityId`）流程**已整個移除**（含前端模組與後端 `GET /activities/:id/order-form`、`POST /activities/:id/orders`）；現在一律走購物車流程。
- **LINE 登入＝LIFF**：整個登入流程集中在 `src/router/index.js` 的 `beforeEach` guard，能力由 `src/shared/composables/liffClient.js` 提供（`ensureLiffReady`/`isLoggedIn`/`getFriendFlag`/`getAccessToken`）。成功後 `authStore.signInWithLiff(accessToken)` → `POST /auth/line/login` 存 token（localStorage `ccAnimateJapan.auth`）。`httpClient` request interceptor 帶 `Authorization: Bearer`、收到 401 清 token。非官方好友導 `/auth/add-friend`；未設 `VITE_LIFF_ID` 時降級導 `/auth/login`。（已不走舊的 OAuth `/auth/line/callback` redirect。）
- **本地免登入（dev-login）**：`import.meta.env.DEV && VITE_DEV_AUTO_LOGIN === 'true'` 時，guard 改打 `authStore.signInWithDev()` → 後端 Development-only `POST /auth/dev-login`（DB 第一筆有效會員發真實 JWT）直接進站。正式 build 此分支被 tree-shake、後端非 Development 回 404。
- **首頁重設計 + 作品頁**：首頁（`modules/home`）改用區塊元件——`HomeBannerCarousel`／`HomeCategoryChips`／`HomePopularActivities`（熱門）／`HomeAnimateTypeRow`（依作品逛）／`HomeOngoingActivities`。新增路由 `/works`（作品列表 `WorkListPage`）與 `/works/:animateTypeId`（作品活動 `WorkActivitiesPage`）。
- **活動／作品 API（activityStore + activityApi）**：`getActivities({animateTypeId,limit})`（`/activities`，活動帶 `animateTypeId/animateTypeName`、支援 `?animateTypeId` 篩選）、`getPopularActivities(limit)`（`/activities/popular`，人氣）、`getWorks(limit)`（`/works`，只回有活動的作品，回 `{id,name,activityCount}`）、`getActivity(id)`（`/activities/{id}`，單筆公開活動，供商品頁取目前活動）。store actions：`fetchActivities`／`fetchPopularActivities`／`fetchWorks`／`fetchActivitiesByWork`／`getOrFetchActivity`（快取優先，未命中才打 `getActivity`；商品頁不再重撈整包活動清單）。

## 環境變數

只有 `VITE_` 開頭的變數會暴露給前端：`VITE_API_BASE_URL`（預設 `/api`）、`VITE_API_PROXY_TARGET`（dev proxy 目標，預設 `http://localhost:5222`）、`VITE_LINE_ADD_FRIEND_URL`（官方帳號加好友連結，非好友頁用）、`VITE_LIFF_ID`（= 後端 `Line:LiffId`，登入入口）、`VITE_DEV_AUTO_LOGIN`（本地免 LINE 登入，預設 `false`，僅 dev 生效，走後端 `POST /auth/dev-login`）。範本見 `.env.example`（複製為 `.env.local` 後填值）。**改 `.env.local` 後要重啟 `npm run dev` 才生效。**
