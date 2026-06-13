# ccAnimateJapan.WebClient Architecture

本文件說明 `ccAnimateJapan.WebClient` 目前前台商城的架構、資料夾責任、資料流與開發規則。此專案是 ccAnimateJapan 面向一般使用者的 Web 前台，主要使用情境是手機瀏覽器、LINE 官方帳號與 LIFF WebView。

資料一律從正式後端 `ccAnimateJapan.WebAPI` 取得（活動／商品／購物車／訂單／作品），**前端已移除所有 mock／假資料切換**，永遠打真 API。進站需 **LINE LIFF 登入＋加官方好友**；本地開發可設 `VITE_DEV_AUTO_LOGIN=true` 改走後端 `POST /auth/dev-login` 快速登入。購物流程如下：

```text
首頁（活動／熱門／依作品逛）
  -> 活動商品列表
  -> 加入購物車
  -> 購物車送出訂單
  -> 我的訂單列表 / 訂單詳情
```

目前沒有獨立 checkout 結帳流程；購物車送出即建立訂單（打後端 `POST /orders`）並導向訂單列表。舊的活動訂購表單模組 `modules/order-form` 已**完全移除**，所有活動訂購統一走購物車流程。

## 技術棧

- Vue 3：元件與頁面開發，採 Composition API。
- Vite：本機開發伺服器、建置與預覽。
- Vue Router：前台頁面路由與 layout 分組。
- Pinia：跨元件狀態管理。
- vue-i18n：繁中與英文語系資源。
- Axios：HTTP client 與 API 呼叫。
- `@line/liff`：LINE LIFF SDK，提供 LINE app 內／外的登入與好友檢查。
- SCSS / Sass：全域樣式、layout 樣式、模組樣式與元件樣式。
- npm：套件管理與 script 執行。
- Vercel rewrite：讓 SPA 重新整理任何路由時都回到 `index.html`。

## 啟動流程

前端入口由 `index.html` 指向 `src/app/main.js`，再掛載到 `#app`。

```text
index.html
  -> src/app/main.js
    -> 建立 Vue app
    -> 註冊 Pinia
    -> 註冊 Vue Router
    -> 註冊 vue-i18n
    -> 載入全域 SCSS 與 shared SCSS
    -> mount 到 #app
```

主要入口檔責任：

- `src/app/main.js`：建立 Vue app，註冊 `pinia`、`router`、`i18n`，並載入 `src/styles/index.scss` 與 `src/shared/styles/index.scss`。
- `src/app/App.vue`：根元件，只保留全站 `RouterView` 與全站 toast 容器 `AppToast`。
- `src/app/router.js`：重新匯出 `src/router/index.js` 的 router，讓 app 入口維持簡潔。
- `src/app/pinia.js`：建立並匯出 Pinia instance。
- `src/app/i18n.js`：建立 vue-i18n instance，預設語系為 `zh-TW`，fallback 為 `en`。

## 根目錄

```text
ccAnimateJapan.WebClient/
├─ src/                 主要前端原始碼
├─ dist/                Vite build 產物，本機建置後產生
├─ node_modules/        npm 相依套件，本機安裝後產生
├─ index.html           Vite SPA HTML 入口
├─ package.json         npm scripts 與 dependencies
├─ package-lock.json    npm lockfile
├─ vite.config.js       Vite、Vue plugin、dev proxy、alias 設定
├─ jsconfig.json        JavaScript tooling 與 @ alias 設定
├─ vercel.json          Vercel SPA rewrite 設定
├─ README.md            專案簡介與文件入口
└─ ARCHITECTURE.md      本架構文件
```

根目錄重點：

- `dist/` 與 `node_modules/` 是產生物，不應手動維護，也不應作為架構邏輯來源。
- `vite.config.js` 設定 `@` 指向 `src`，並把本機 `/api` proxy 到 `VITE_API_PROXY_TARGET`，預設為 `http://localhost:5222`。
- `vercel.json` 將所有路徑 rewrite 到 `/index.html`，支援 Vue Router history mode 的前端路由。
- `jsconfig.json` 讓編輯器理解 `@/* -> src/*`，與 Vite alias 保持一致。

## src 目錄總覽

```text
src/
├─ app/        應用程式入口與 plugin 初始化
├─ assets/     靜態資源預留位置
├─ layouts/    頁面外框與 layout 專用樣式
├─ locales/    多語系 JSON
├─ modules/    依業務領域切分的功能模組
├─ router/     Vue Router 組裝與 layout 分組
├─ shared/     跨模組共用的 API、元件、工具、常數、store
└─ styles/     全域 SCSS foundation
```

架構核心原則：

- `app/` 負責初始化，不放業務邏輯。
- `router/` 負責組裝路由，不直接處理畫面資料。
- `layouts/` 負責頁面外框，不承擔特定業務流程。
- `modules/` 以業務領域為界線，每個模組管理自己的頁面、元件、API、store、樣式與路由。
- `shared/` 放真正跨模組共用的能力，不能依賴任何特定 module。
- `styles/` 放全域樣式基礎，不放單一頁面或單一元件的樣式。

## 現行頁面流程

正式商城目前流程：

```text
/                             首頁（輪播、分類、熱門活動、依作品逛、進行中活動、指南）
/activities/:activityId/products
                              活動商品列表，一行兩筆商品的手機版 grid
/works                        作品列表（依作品逛）
/works/:animateTypeId         特定作品底下的活動列表
/cart                         購物車，可修改數量、刪除商品、送出訂單
/orders                       我的訂單列表
/orders/:id                   訂單詳情簡版
/auth/login                   LINE 登入導向頁（LIFF 未配置時的降級頁）
/auth/line/callback           LINE callback 防呆頁（LIFF 流程不走 OAuth callback）
/auth/add-friend              非官方帳號好友時的加好友頁
```

> Route guard（`src/router/index.js` 的 `router.beforeEach`）：未登入（localStorage `ccAnimateJapan.auth` 無 `accessToken`）一律導 `/auth/login`；登入相關路由（login / line-callback / add-friend）放行。已設 `VITE_LIFF_ID` 時會在 guard 內啟動 LIFF 登入流程（需加官方好友才進站）；本地若 `import.meta.env.DEV && VITE_DEV_AUTO_LOGIN=true` 則改打後端 `POST /auth/dev-login` 快速登入。

目前特別沒有：

- 沒有獨立 `/checkout` route。
- 沒有 `modules/checkout`、`CheckoutLayout`。
- 沒有舊的 `order-form` 流程（`/activity/:activityId` 已移除）。
- 沒有商品詳情 route；`/products` 會 redirect 回首頁。
- 沒有多活動合併訂單；購物車一次只允許同一個活動的商品。

## app/

```text
src/app/
├─ App.vue
├─ i18n.js
├─ main.js
├─ pinia.js
└─ router.js
```

資料夾功能：

- `App.vue`：最上層根元件。它渲染目前路由對應的 layout/page，並放置全站 `AppToast`。
- `main.js`：唯一的前端啟動點。所有全域 plugin、全域樣式都在此註冊。
- `pinia.js`：建立 Pinia instance。
- `router.js`：app 層的 router facade，目前只重新匯出 `@/router`。
- `i18n.js`：集中設定 locale、fallbackLocale 與 message bundle。

放置規則：

- 可以放 app 啟動必備的初始化設定。
- 不放頁面、API 呼叫、業務 store、業務元件。
- 若某段程式只服務單一功能模組，應放回該 module。

## assets/

```text
src/assets/
├─ icons/
├─ images/
└─ logo/
```

資料夾功能：

- `icons/`：放專案自有 icon 檔，例如 SVG、PNG icon。
- `images/`：放產品以外的前端靜態圖片，例如 banner、視覺素材、預設空狀態圖片。
- `logo/`：放品牌 logo、商標相關圖檔。

放置規則：

- 由 API 回傳的圖片 URL 不放在 `assets/`。
- 大型使用者上傳檔案不應放入前端 repo。

## layouts/

```text
src/layouts/
├─ AuthLayout.vue
├─ DefaultLayout.vue
└─ styles/
   ├─ auth-layout.scss
   └─ default-layout.scss
```

資料夾功能：

- `DefaultLayout.vue`：正式商城一般頁面外框。包含 mobile-first 單行 sticky header、品牌 logo、導覽、購物車數量 badge、手機版漢堡選單（`useMobileMenu`）、`RouterView` 與 footer。
- `AuthLayout.vue`：登入與相關頁面的簡化 layout。
- `styles/default-layout.scss`：一般頁面外框與 header 樣式。
- `styles/auth-layout.scss`：登入頁外框樣式。

放置規則：

- layout 可以引用 shared constants、shared components，以及必要的跨頁狀態，例如 `cartStore.totalQuantity`。
- layout 不應直接呼叫業務 API。
- layout 不應塞入單一頁面的主要內容；主要內容應由 route page 提供。

## locales/

```text
src/locales/
├─ en.json
└─ zh-TW.json
```

資料夾功能：

- `zh-TW.json`：繁體中文翻譯 key（預設語系）。
- `en.json`：英文翻譯 key，作為 fallback locale。

使用方式：

- 在 Vue 元件中透過 `useI18n()` 取得 `t()`。
- 翻譯 key 應依功能命名，例如 `nav.products`、`work.listTitle`、`home.popular.title`、`order.status.customerPaid`。
- 新增畫面文字時，要同步補齊 `zh-TW.json` 與 `en.json`。

## router/

```text
src/router/
└─ index.js
```

資料夾功能：

- 建立 `createRouter` 與 `createWebHistory`。
- 匯入 `DefaultLayout` 與 `AuthLayout`。
- 匯入各 module 的 `routes.js`，再依 layout 分組。
- 設定萬用路由 `/:pathMatch(.*)*`，未知路徑導回首頁。
- 設定 `scrollBehavior()`，換頁時回到頁面頂端；若有 hash 會平滑捲動到目標區塊。
- `router.beforeEach` 守衛集中整個登入流程：已有 session 放行；本地 dev-login 分支（`import.meta.env.DEV && VITE_DEV_AUTO_LOGIN`）；否則走 LIFF 流程（`ensureLiffReady` → `isLoggedIn` → `getFriendFlag` → `signInWithLiff`），未配置 `VITE_LIFF_ID` 時降級到 `/auth/login`。

目前路由分組：

```text
/                              -> DefaultLayout
  /                            -> home
  /activities/:activityId/products
                               -> activity products
  /products                    -> redirect home
  /works                       -> work list（依作品逛）
  /works/:animateTypeId        -> work activities（特定作品的活動）
  /cart                        -> cart
  /orders                      -> order list
  /orders/:id                  -> order detail
  /member/profile              -> member profile
  /member/addresses            -> member address book

/auth                          -> AuthLayout
  /auth/login
  /auth/line/callback
  /auth/add-friend
```

路由命名：

- route name 統一放在 `src/shared/constants/routes.js` 的 `ROUTE_NAMES`。
- module 的 `routes.js` 只引用 `ROUTE_NAMES`，不要手寫散落的 route name 字串。
- 新增路由時，先補 route name，再補 module route，最後確認 `src/router/index.js` 是否需要加入對應 layout group。

## styles/

```text
src/styles/
├─ index.scss
├─ reset.scss
├─ utilities.scss
└─ variables.scss
```

資料夾功能：

- `reset.scss`：瀏覽器預設樣式重置。
- `variables.scss`：全域設計 token，例如顏色、間距、陰影、字體或斷點。
- `utilities.scss`：可跨頁面使用的 utility class。
- `index.scss`：全域樣式入口，集中引入 reset、variables、utilities，並定義基本元素樣式。

樣式分層：

1. 全域 foundation 放 `src/styles/`。
2. 共用元件樣式放 `src/shared/styles/` 或元件自己的 scoped style。
3. layout 外框樣式放 `src/layouts/styles/`。
4. module page/component 樣式放各 module 的 `styles/`。
5. 單一 `.vue` 元件需要非常局部的樣式時，可使用 `<style scoped lang="scss">` 再 `@use` 該模組樣式。

## shared/

```text
src/shared/
├─ api/
├─ components/
├─ composables/
├─ constants/
├─ stores/
├─ styles/
└─ utils/
```

`shared` 是底層共用層，可以被任何 module 使用，但不能依賴 `src/modules/*`。

### shared/api/

```text
src/shared/api/
├─ apiResponse.js
├─ apiResponse.test.js
└─ httpClient.js
```

- `httpClient.js`：建立 Axios instance。預設 `baseURL` 為 `VITE_API_BASE_URL`（未設用 `/api`）；timeout 15 秒。**request interceptor** 會從 localStorage `ccAnimateJapan.auth` 取 `accessToken` 帶上 `Authorization: Bearer`；**response interceptor** 成功回傳 `response.data`、遇 401 清掉 token 並導回登入頁（動態 import 避免與 authStore 形成循環相依）。
- `apiResponse.js`：提供 `unwrapApiResponse()`，處理後端包裝格式 `{ status, data, message }`，當 `status !== '200'` 時丟出錯誤，成功時回傳 `data`。
- `apiResponse.test.js`：API response helper 的測試。

> 已移除 mock 切換層：沒有 `mockMode.js`，各 API 檔直接呼叫 `httpClient`，不要再加回假資料分支。

### shared/components/

```text
src/shared/components/
├─ AppButton.vue
├─ AppCarousel.vue
├─ AppEmpty.vue
├─ AppLoading.vue
├─ AppModal.vue
├─ AppPrice.vue
└─ AppToast.vue
```

- `AppButton`：共用按鈕元件。
- `AppCarousel`：共用水平輪播／捲動容器，首頁多個區塊使用。
- `AppEmpty`：空狀態元件。
- `AppLoading`：載入狀態元件。
- `AppModal`：共用 modal 元件，目前被商品加入購物車 dialog 使用。
- `AppPrice`：金額顯示元件。
- `AppToast`：全站 toast 顯示容器，搭配 `shared/stores/uiStore.js`。

### shared/composables/

```text
src/shared/composables/
├─ liffClient.js
├─ useConfirm.js
├─ useLoading.js
└─ usePagination.js
```

- `liffClient.js`：封裝 LINE LIFF SDK，供 router guard 與 auth store 使用：`isLiffConfigured()`（檢查 `VITE_LIFF_ID`）、`ensureLiffReady()`（幂等 `liff.init()`）、`isLoggedIn()`、`login(redirectUri)`（外部瀏覽器導向 LINE）、`getFriendFlag()`（官方帳號好友）、`getAccessToken()`。
- `useConfirm.js`：封裝確認對話框流程。
- `useLoading.js`：封裝 loading 狀態控制。
- `usePagination.js`：封裝分頁狀態與計算。

### shared/constants/

```text
src/shared/constants/
├─ externalLinks.js
├─ orderStatus.js
└─ routes.js
```

- `routes.js`：集中管理 `ROUTE_NAMES`（含 `WORK_LIST`、`WORK_ACTIVITIES`）。
- `orderStatus.js`：訂單狀態代碼、狀態翻譯 key、badge variant 與 helper。
- `externalLinks.js`：外部連結常數（例如官方帳號、社群連結）。

### shared/stores/

```text
src/shared/stores/
├─ appStore.js
└─ uiStore.js
```

- `appStore.js`：全站 app 狀態，例如 locale 與 initialized。
- `uiStore.js`：全站 UI 狀態，例如 global loading、modal、toast。

### shared/styles/

```text
src/shared/styles/
└─ index.scss
```

放 shared UI pattern 或 shared component 需要的共同樣式入口，由 `src/app/main.js` 全域載入。

### shared/utils/

```text
src/shared/utils/
├─ date.js
├─ money.js
├─ storage.js
└─ validation.js
```

- `date.js`：日期與日期時間格式化 helper。
- `money.js`：金額格式化 helper。
- `storage.js`：localStorage/sessionStorage 讀寫封裝。
- `validation.js`：表單驗證 helper，例如必填、email 格式。

## modules/

```text
src/modules/
├─ activity/
├─ auth/
├─ cart/
├─ home/
├─ member/
├─ order/
└─ product/
```

常見 module 內部資料夾：

- `pages/`：路由直接掛載的頁面元件。
- `components/`：只服務該 module 的 UI 元件。
- `api/`：該 module 的後端 endpoint 封裝。
- `stores/`：該 module 的 Pinia store。
- `composables/`：該 module 私有的 Composition API helper。
- `utils/`：該 module 私有的純函式或業務規則。
- `styles/`：該 module 的 SCSS。
- `routes.js`：該 module 對外提供的路由設定。

### modules/activity/

```text
src/modules/activity/
├─ api/
│  └─ activityApi.js
├─ pages/
│  ├─ WorkActivitiesPage.vue
│  └─ WorkListPage.vue
├─ routes.js
├─ stores/
│  └─ activityStore.js
└─ styles/
   ├─ work-activities.scss
   └─ work-list.scss
```

資料夾功能：

- `api/activityApi.js`：封裝活動與作品 API——`getActivities({ animateTypeId, limit })`（打 `/activities`，`animateTypeId` 用於作品 drill-down）、`getPopularActivities(limit)`（打 `/activities/popular`）、`getWorks(limit)`（打 `/works`）。
- `stores/activityStore.js`：管理 `activities`、`popularActivities`、`works` 狀態與載入／錯誤狀態，提供 `fetchActivities()`、`fetchPopularActivities()`、`fetchWorks(limit)` 與 `fetchActivitiesByWork(animateTypeId)`。
- `pages/WorkListPage.vue`：作品列表頁，路由 `/works`，使用 `works`。
- `pages/WorkActivitiesPage.vue`：特定作品底下的活動，路由 `/works/:animateTypeId`，使用 `fetchActivitiesByWork()`。
- `routes.js`：定義 `/works` 與 `/works/:animateTypeId`。

模組定位：

- `activity` 負責活動資料、人氣活動與作品（animateType）列表與相關路由。
- 活動資料現在會帶 `animateTypeId` / `animateTypeName`（後端 `/activities` 已 join 作品表），活動卡片據此顯示作品標籤。

### modules/home/

```text
src/modules/home/
├─ components/
│  ├─ HomeActivityCard.vue
│  ├─ HomeAnimateTypeRow.vue
│  ├─ HomeBannerCarousel.vue
│  ├─ HomeCategoryChips.vue
│  ├─ HomeOngoingActivities.vue
│  └─ HomePopularActivities.vue
├─ config/
│  └─ homeBanners.js
├─ pages/
│  └─ HomePage.vue
├─ routes.js
├─ styles/
│  └─ *.scss
└─ utils/
   └─ activityFilters.js
```

資料夾功能：

- `pages/HomePage.vue`：首頁，由下列區塊元件組合，並以「可預購／現貨」篩選 chip 過濾進行中活動。
- `components/HomeBannerCarousel.vue`：輪播 banner（資料來自 `config/homeBanners.js`）。
- `components/HomeCategoryChips.vue`：可用狀態篩選 chip。
- `components/HomePopularActivities.vue`：「熱門活動」區塊，mount 時 `fetchPopularActivities(5)`。
- `components/HomeAnimateTypeRow.vue`：「依作品逛」區塊，mount 時 `fetchWorks(10)`，可 drill-down 到 `/works/:animateTypeId`。
- `components/HomeOngoingActivities.vue`：進行中活動列表，由 HomePage 傳入篩選後的活動。
- `components/HomeActivityCard.vue`：首頁活動卡片（含作品標籤、預購／現貨 badge、排名），由熱門、進行中、作品頁共用。
- `config/homeBanners.js`：首頁輪播 banner 設定。
- `utils/activityFilters.js`：`filterByAvailability()` 等首頁活動篩選純函式（依 `isPreOrder`）。
- `routes.js`：定義首頁路由 `path: ''`、`name: ROUTE_NAMES.HOME`。
- `components/ActivityCard.vue`、`ActivitySection.vue`、`HeroBanner.vue`、`ProductSection.vue`（與對應 `activity-card.scss`／`activity-section.scss`／`hero-banner.scss`）為改版前保留檔，目前首頁已改用上述 `Home*` 區塊、不再使用。

### modules/product/

```text
src/modules/product/
├─ api/
│  └─ productApi.js
├─ components/
│  ├─ ProductAddDialog.vue
│  ├─ ProductCard.vue
│  ├─ ProductFilter.vue
│  └─ ProductImageGallery.vue
├─ pages/
│  ├─ ProductDetailPage.vue
│  └─ ProductListPage.vue
├─ routes.js
├─ stores/
│  └─ productStore.js
└─ styles/
   ├─ product-add-dialog.scss
   ├─ product-card.scss
   ├─ product-detail.scss
   ├─ product-filter.scss
   ├─ product-gallery.scss
   └─ product-grid.scss
```

資料夾功能：

- `api/productApi.js`：封裝活動商品列表（`getActivityProductCatalog(activityId)` 同時取活動與商品），可依 `activityId` 取得。
- `stores/productStore.js`：管理目前活動、活動商品清單、載入狀態、錯誤狀態與分類狀態。
- `pages/ProductListPage.vue`：活動商品頁，路由為 `/activities/:activityId/products`。
- `components/ProductCard.vue`：商品卡片，顯示圖片、分類、名稱、價格、簡短備註與加入購物車按鈕。
- `components/ProductAddDialog.vue`：加入購物車 dialog，可選數量、填備註，確認後交給 cart store。
- `components/ProductFilter.vue`、`ProductImageGallery.vue`、`pages/ProductDetailPage.vue`：保留的舊／預留檔案，目前 MVP 沒有商品詳情 route。
- `routes.js`：定義活動商品頁；舊 `/products` route 會 redirect 回首頁。

模組定位：

- `product` 負責活動商品列表與商品加入購物車入口。
- 商品專用 UI 放在 `product/components`，不放到 `shared/components`。

### modules/cart/

```text
src/modules/cart/
├─ api/
│  └─ cartApi.js
├─ components/
│  ├─ CartItem.vue
│  ├─ CartSummary.vue
│  └─ QuantityControl.vue
├─ pages/
│  └─ CartPage.vue
├─ routes.js
├─ stores/
│  └─ cartStore.js
└─ styles/
   ├─ cart-item.scss
   ├─ cart-page.scss
   ├─ cart-summary.scss
   └─ quantity-control.scss
```

資料夾功能：

- `stores/cartStore.js`：管理購物車品項、總數量、小計、活動限制、加入/更新/移除/清空，透過 `cart/api/cartApi.js` 與後端同步，操作後以伺服器回傳的購物車覆蓋本地（**伺服器為準**）。
- `api/cartApi.js`：購物車 4 支端點封裝（`GET /cart`、`POST /cart/items`、`PUT/DELETE /cart/items/{id}`）。
- `pages/CartPage.vue`：購物車頁。送出時呼叫 `order/api/createOrderFromCartItems()`（打 `POST /orders`），成功後清空購物車並導向 `/orders`。
- `components/CartItem.vue`：單筆購物車項目，顯示商品名稱、活動名稱、單價、數量、備註、小計與刪除。
- `components/CartSummary.vue`：購物車摘要，顯示活動名稱、總數量、小計與送出訂單按鈕。
- `components/QuantityControl.vue`：數量調整控制。
- `routes.js`：定義 `/cart`。

購物車 item 結構：

```js
{
  id,
  activityId,
  activityName,
  productId,
  productName,
  imageUrl,
  price,
  quantity,
  note,
  info
}
```

MVP 限制：

- 一次只允許同一個活動的商品在購物車中（由後端把關）。
- 不走獨立 checkout；購物車送出即建立訂單（打後端 `POST /orders`）。

### modules/order/

```text
src/modules/order/
├─ api/
│  └─ orderApi.js
├─ components/
│  ├─ OrderCard.vue
│  └─ OrderStatusBadge.vue
├─ pages/
│  ├─ OrderDetailPage.vue
│  └─ OrderListPage.vue
├─ routes.js
└─ styles/
   ├─ order-card.scss
   ├─ order-list.scss
   └─ status-badge.scss
```

資料夾功能：

- `api/orderApi.js`：封裝訂單列表、訂單詳情與 `createOrderFromCartItems()`，打後端 `GET /orders`、`GET /orders/{id}`、`POST /orders`（皆需登入帶 token）。
- `pages/OrderListPage.vue`：訂單列表頁。
- `pages/OrderDetailPage.vue`：訂單詳情簡版，接收 `id` route param。
- `components/OrderCard.vue`：訂單摘要卡片，顯示訂單編號、活動名稱、總金額、付款狀態、處理狀態、建立時間。
- `components/OrderStatusBadge.vue`：訂單狀態 badge，搭配 `shared/constants/orderStatus.js`。
- `routes.js`：定義 `/orders` 與 `/orders/:id`。

### modules/auth/

```text
src/modules/auth/
├─ api/
│  └─ authApi.js
├─ pages/
│  ├─ AddFriendPage.vue
│  ├─ LineCallbackPage.vue
│  └─ LoginPage.vue
├─ routes.js
├─ stores/
│  └─ authStore.js
└─ styles/
   └─ auth-form.scss
```

資料夾功能：

- `api/authApi.js`：`loginWithLiff(accessToken)` → `POST /auth/line/login`（LIFF 登入）、`devLogin()` → `POST /auth/dev-login`（本地開發專用）。
- `stores/authStore.js`：管理登入 session（`accessToken` + `user`），持久化於 localStorage `ccAnimateJapan.auth`；提供 `signInWithLiff(accessToken)`、`signInWithDev()`、`signOut()`。
- `pages/LoginPage.vue`：登入頁／重試入口（LIFF 流程主要由 router guard 驅動）。
- `pages/LineCallbackPage.vue`：LINE callback 防呆頁（LIFF 不走 OAuth callback，僅作降級導回）。
- `pages/AddFriendPage.vue`：非官方帳號好友時的加好友頁，連到 `VITE_LINE_ADD_FRIEND_URL`。
- `routes.js`：定義 `/auth/login`、`/auth/line/callback`、`/auth/add-friend`，並將 `/auth` redirect 到 login。

> 登入流程的編排（LIFF init／好友檢查／dev-login 分支）集中在 `src/router/index.js` 的 `beforeEach`，見「LINE LIFF 登入流程」一節。

### modules/member/

```text
src/modules/member/
├─ api/
│  └─ memberApi.js
├─ components/
│  ├─ AddressForm.vue
│  └─ ProfileForm.vue
├─ pages/
│  ├─ AddressBookPage.vue
│  └─ ProfilePage.vue
├─ routes.js
└─ styles/
   ├─ address-book.scss
   └─ address-form.scss
```

資料夾功能：

- `api/memberApi.js`：封裝會員資料、更新會員資料與地址清單 API。
- `pages/ProfilePage.vue`：會員資料頁。
- `pages/AddressBookPage.vue`：會員地址簿頁。
- `components/ProfileForm.vue`：會員資料表單。
- `components/AddressForm.vue`：地址表單。
- `routes.js`：定義 `/member/profile` 與 `/member/addresses`。

模組定位：

- `member` 負責會員中心資料維護。

## LINE LIFF 登入流程

進站（除登入相關路由外）需 LIFF 登入，邏輯集中在 `src/router/index.js` 的 `router.beforeEach`，能力由 `src/shared/composables/liffClient.js` 提供：

1. 已有 session（localStorage `ccAnimateJapan.auth` 有 `accessToken`）→ 放行。
2. **本地 dev-login**：`import.meta.env.DEV && VITE_DEV_AUTO_LOGIN === 'true'` 時，呼叫 `authStore.signInWithDev()`（打 `POST /auth/dev-login`，用 DB 第一筆有效會員發真實 JWT）直接進站。此分支只在 dev build 存在（正式 build 被 tree-shake 移除），後端非 Development 也回 404。
3. **LIFF 流程**：未設 `VITE_LIFF_ID` → 導 `/auth/login`；否則 `ensureLiffReady()` → 若 `!isLoggedIn()` 則 `login(redirectUri)` 導向 LINE → `getFriendFlag()` 為 false 導 `/auth/add-friend` → `authStore.signInWithLiff(getAccessToken())` 換後端 session。

登入成功後 `httpClient` request interceptor 自動帶 `Authorization: Bearer`；遇 401 清掉 token 並重導登入頁。

## 依賴方向

建議維持以下依賴方向：

```text
app
  -> router
  -> layouts
  -> modules
  -> shared

router
  -> layouts
  -> modules routes
  -> shared constants
  -> modules auth store + shared liffClient（登入守衛）

layouts
  -> modules stores/components when needed
  -> shared

modules
  -> shared

shared
  -> 不依賴 modules
```

規則：

- `shared` 不能 import `modules`。
- module 之間盡量不要直接互相 import；若真的有跨 module 共用需求，優先抽到 `shared`。
- page 可以協調 store、API、route params 與元件，但應避免塞入過多可重用邏輯。
- component 應以 props/emit 為主要介面，避免直接知道太多外部狀態。
- API function 應隱藏 endpoint 細節，讓 page/store 呼叫語意化函式。

## 資料流

首頁資料流（各區塊各自取資料）：

```text
HomePage
  -> HomeOngoingActivities  -> activityStore.fetchActivities()        -> activityApi.getActivities()       -> GET /api/activities
  -> HomePopularActivities  -> activityStore.fetchPopularActivities() -> activityApi.getPopularActivities()-> GET /api/activities/popular
  -> HomeAnimateTypeRow     -> activityStore.fetchWorks(10)           -> activityApi.getWorks(10)          -> GET /api/works
```

作品 drill-down 與活動商品資料流：

```text
WorkActivitiesPage
  -> activityStore.fetchActivitiesByWork(animateTypeId) -> activityApi.getActivities({ animateTypeId }) -> GET /api/activities?animateTypeId=...

ProductListPage
  -> productStore.fetchProductsByActivity(activityId)
  -> productApi.getActivityProductCatalog(activityId)  -> GET /api/activities/{id}/products（並行取活動資訊）
  -> ProductCard -> ProductAddDialog
```

購物車與訂單資料流（皆走後端、帶 JWT）：

```text
ProductAddDialog
  -> cartStore.addItem()
  -> cartApi.addCartItem() -> POST /cart/items（以伺服器回傳覆蓋本地）

CartPage
  -> createOrderFromCartItems(cart.items)
  -> POST /orders（後端清空伺服器購物車）
  -> cartStore.clearCart()
  -> /orders
```

常見模式：

- 列表資料：由 module store 管理，例如 `activityStore`、`productStore`。
- 全站 UI 狀態：由 `shared/stores/uiStore.js` 管理。
- localStorage 持久化：透過 `shared/utils/storage.js` 封裝（例如登入 session）。

## API 層規則

API 層分兩種：

- 共用 API 基礎：`src/shared/api/`
- 業務 API endpoint：`src/modules/{module}/api/`

目前 API 檔案：

```text
src/shared/api/httpClient.js
src/shared/api/apiResponse.js
src/modules/activity/api/activityApi.js
src/modules/auth/api/authApi.js
src/modules/cart/api/cartApi.js
src/modules/member/api/memberApi.js
src/modules/order/api/orderApi.js
src/modules/product/api/productApi.js
```

規則：

- 所有 HTTP 呼叫一律透過 `httpClient`（已無 mock 分支）。
- 後端回傳統一包裝格式 `{ status, data, message }`，用 `unwrapApiResponse()` 解開（`status !== '200'` 丟錯）。
- API function 命名要描述業務意圖，例如 `getActivities()`、`getPopularActivities()`、`getWorks()`、`getActivityProductCatalog()`、`createOrderFromCartItems()`。

## Store 規則

Pinia store 放置位置：

- module 狀態：`src/modules/{module}/stores/`
- 全站共用狀態：`src/shared/stores/`

目前 store：

```text
src/modules/activity/stores/activityStore.js
src/modules/auth/stores/authStore.js
src/modules/cart/stores/cartStore.js
src/modules/product/stores/productStore.js
src/shared/stores/appStore.js
src/shared/stores/uiStore.js
```

規則：

- store 管理跨元件共享或流程型狀態。
- 單一元件內部狀態保留在元件內，不必抽成 store。
- store action 可以呼叫 module API。
- store 不應處理 DOM 操作。
- 需要持久化時透過 shared storage helper，不直接散落 `localStorage` 呼叫。

## 測試檔

目前測試檔與被測程式放在同一個資料夾，用 Node 內建 `node:test` + `node:assert/strict`，以 `node --test` 執行（沒有 test script／測試框架）：

```text
src/shared/api/apiResponse.test.js
src/layouts/useMobileMenu.test.js
```

規則：

- 純函式、資料轉換、重要業務規則優先補測試。
- 測試檔使用 `*.test.js` 命名，與來源檔 colocate。
- 若之後測試數量變多，可再補 Vitest 設定與集中測試 script。

## 新增功能的建議流程

新增一個業務模組時：

1. 在 `src/modules/{feature}/` 建立資料夾。
2. 建立 `pages/`，放 route page。
3. 視需要建立 `components/`、`api/`、`stores/`、`composables/`、`utils/`、`styles/`。
4. 建立 `routes.js`。
5. 在 `src/shared/constants/routes.js` 增加 route name。
6. 在 `src/router/index.js` 將 module routes 加入合適的 layout group。
7. 將畫面文字補到 `src/locales/zh-TW.json` 與 `src/locales/en.json`。
8. 對資料轉換、驗證、重要流程規則補測試。

新增 shared 能力時：

1. 先確認是否真的會被兩個以上 module 使用。
2. 放到 `shared/components`、`shared/composables`、`shared/utils`、`shared/constants`、`shared/stores` 或 `shared/api` 中合適的位置。
3. 避免 shared import module。
4. 若 shared helper 有分支邏輯，補上 colocated test。

## 命名規則

- Vue component：PascalCase，例如 `ProductCard.vue`。
- page component：以 `Page` 結尾，例如 `ProductListPage.vue`。
- composable：`useXxx.js`，例如 `useLoading.js`。
- Pinia store 檔案：`xxxStore.js`，匯出 `useXxxStore`。
- API 檔案：`xxxApi.js`。
- route name：集中在 `ROUTE_NAMES`。
- SCSS：依功能命名，使用 kebab-case，例如 `product-card.scss`。
- 測試檔：與來源檔同名加 `.test.js`。

## 環境變數

目前前端使用的環境變數（見 `.env.example`）：

- `VITE_API_BASE_URL`：前端呼叫 API 的 base URL。未設定時使用 `/api`。
- `VITE_API_PROXY_TARGET`：Vite dev server proxy `/api` 的目標，未設定時為 `http://localhost:5222`。
- `VITE_LIFF_ID`：LINE LIFF ID（= 後端 `Line:LiffId`）。未設定時 route guard 降級到 `/auth/login`；設定後進站走 LIFF 登入流程。
- `VITE_LINE_ADD_FRIEND_URL`：官方帳號加好友連結，非好友時的加好友頁用。
- `VITE_DEV_AUTO_LOGIN`：本地開發免 LINE 登入（`true`/`false`，預設 `false`）。僅在 `npm run dev`（`import.meta.env.DEV`）生效；設 `true` 時 route guard 改打後端 `POST /auth/dev-login` 快速登入，正式 build 會被 tree-shake 移除。

複製 `.env.example` 為 `.env.local` 後填值（`.env.local` 不進 git）；改 `.env.local` 後需重啟 `npm run dev` 才會生效。

注意：

- Vite 只會將 `VITE_` 開頭的環境變數暴露給前端程式。
- 不要把後端 secret、private key 或不可公開的 token 放進前端環境變數。

## 開發指令

```bash
npm install
npm run dev
npm run build
npm run preview

node --test                                  # 執行所有 *.test.js
node --test src/shared/api/apiResponse.test.js   # 執行單一測試檔
```

script 說明：

- `npm run dev`：啟動 Vite dev server，host 為 `0.0.0.0`。
- `npm run build`：建置正式環境檔案到 `dist/`。
- `npm run preview`：預覽 build 產物，host 為 `0.0.0.0`。

若需要指定本機 port：

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

## 未來可改善項目

- 補上正式測試 script，例如 Vitest，讓現有 `*.test.js` 可由 CI 執行。
- 補上端到端測試，覆蓋首頁、依作品逛、活動商品、加入購物車、送出訂單、訂單查詢與 LIFF 登入/好友檢查流程。
- 考慮增加商品詳情頁面（目前 MVP 無此功能，`ProductDetailPage.vue` 為預留）。
- 考慮支援跨活動購物車（目前 MVP 一次只允許同一活動的商品）。
