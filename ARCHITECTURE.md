# ccAnimateJapan.WebClient Architecture

本文件說明 `ccAnimateJapan.WebClient` 的前端架構、目錄責任、模組邊界與開發約定。此專案使用 Vue 3、JavaScript、Vite、Vue Router、Pinia、vue-i18n、axios 與 SCSS。

## 架構目標

- 以業務功能模組切分程式碼，降低不同功能之間的耦合。
- 將啟動設定、版型、共用元件、共用狀態與業務模組分層管理。
- 讓每個功能模組能獨立維護自己的頁面、元件、API、store 與 routes。
- 保留未來串接後端 API、LINE Login、會員中心與結帳流程的擴充空間。

## 啟動流程

應用程式入口位於 `src/app/main.js`。

```text
index.html
  -> src/app/main.js
    -> 建立 Vue app
    -> 載入 Pinia
    -> 載入 Vue Router
    -> 載入 vue-i18n
    -> 載入全域樣式
    -> 掛載到 #app
```

主要啟動檔案：

- `src/app/main.js`：Vue 入口，集中註冊 app plugin。
- `src/app/App.vue`：根元件，只負責渲染 `RouterView`。
- `src/app/router.js`：重新匯出整合後的 router。
- `src/app/pinia.js`：建立 Pinia instance。
- `src/app/i18n.js`：建立多語系設定。

## 目錄責任

```text
src/
├─ app/        專案啟動設定
├─ layouts/    頁面外框與主要版型
├─ modules/    業務功能模組
├─ shared/     全專案共用程式碼
├─ router/     路由整合
├─ locales/    多語系字典
├─ styles/     全域 SCSS
└─ assets/     靜態資源
```

### app

`app` 是應用程式啟動層，只放全域初始化設定。這一層不放業務邏輯，也不直接操作商品、訂單或會員資料。

### layouts

`layouts` 定義頁面外框：

- `DefaultLayout.vue`：前台主要版型，包含 Header、Footer 與 `router-view`。
- `CheckoutLayout.vue`：結帳流程版型，包含結帳步驟與流程頁面。
- `AuthLayout.vue`：登入頁版型。
- `styles/`：layout 專用 SCSS，例如 header、footer、shell、auth layout。

Layout 負責頁面框架與區域安排，不承擔實際業務資料處理。

### modules

`modules` 依業務功能切分。每個模組可以包含：

- `pages/`：路由頁面元件。
- `components/`：模組內專用元件。
- `api/`：模組 API 存取。
- `stores/`：模組狀態。
- `styles/`：模組自己的頁面與元件 SCSS。
- `routes.js`：模組路由定義。

目前模組：

- `home`：首頁、Hero、精選商品區。
- `product`：商品列表、商品明細、商品篩選、商品 store。
- `cart`：購物車、數量控制、購物車摘要、購物車 store。
- `checkout`：收件資料、付款方式、訂單完成。
- `order`：訂單列表、訂單明細、狀態標籤。
- `auth`：一般登入、LINE Login callback、登入狀態。
- `member`：會員資料、常用地址。

### shared

`shared` 放跨模組共用的程式碼。業務模組可以依賴 `shared`，但 `shared` 不應依賴任何特定業務模組。

子目錄責任：

- `api/httpClient.js`：axios instance 與 HTTP 共用設定。
- `components/`：跨頁面共用 UI 元件，例如 Button、Modal、Loading、Empty、Price。
- `composables/`：跨模組共用 Composition API 邏輯。
- `constants/`：路由名稱、付款方式、訂單狀態等常數。
- `utils/`：純函式工具，例如金額、日期、storage、validation。
- `stores/`：全域狀態，例如 UI 與 app 初始化狀態。
- `styles/`：shared component 與跨模組 UI pattern 的 SCSS。

### router

`src/router/index.js` 是全站路由整合點。

路由整合方式：

- 各模組在自己的 `routes.js` 定義 route。
- `src/router/index.js` 匯入模組 routes。
- 依版型分組掛到 `DefaultLayout`、`CheckoutLayout` 或 `AuthLayout`。

這樣新增模組時，只需要：

1. 在 `src/modules/{module}/routes.js` 定義路由。
2. 在 `src/router/index.js` 匯入並加入對應 layout children。
3. 在 `src/shared/constants/routes.js` 補上 route name。

### locales

多語系字典放在：

- `src/locales/zh-TW.json`
- `src/locales/en.json`

Vue 元件內使用 `useI18n()` 取得 `t()`。畫面文字應優先放入 locales，避免散落在元件中。

### styles

全域樣式入口是 `src/styles/index.scss`。

- `reset.scss`：基本 reset。
- `variables.scss`：全域色彩、設計 token。
- `utilities.scss`：真正全站共用的 utility class，例如 section、eyebrow。
- `index.scss`：只匯入 reset、variables、utilities，並放全站 base element 樣式。

CSS / SCSS 分類規則：

1. `src/styles/` 只放全站共用樣式，例如 reset、base、variables、utilities。
2. 不可以把所有頁面或元件 CSS 都放進 `src/styles/`。
3. 每個 module 自己的頁面與元件樣式，放在該 module 的 `styles/` 資料夾。
4. layout 相關樣式，放在 `src/layouts/styles/`。
5. shared component 的樣式，放在 `src/shared/styles/`。
6. 單一元件很小的樣式，可以直接寫在 `.vue` 的 `<style scoped>`。
7. 如果樣式只被某個 module 使用，不可以放到全域 styles。

分類對照：

- 全域樣式：`src/styles/`
- Layout 樣式：`src/layouts/styles/`
- 商品樣式：`src/modules/product/styles/`
- 購物車樣式：`src/modules/cart/styles/`
- 共用元件樣式：`src/shared/styles/`

模組樣式應由該模組的頁面或元件透過 `<style scoped lang="scss">` 匯入，避免模組專屬 CSS 重新變成全域樣式。

## 開發規則

- `pages/` 只負責組合畫面、串接 route props 與呼叫 store action，不直接寫 API 邏輯。
- `components/` 只負責 UI 呈現、接收 props 與 emit 事件，不直接處理資料取得或跨頁狀態。
- API 存取請放在各 module 的 `api/` 目錄，例如 `src/modules/product/api/`。
- 狀態請放在 Pinia store；模組狀態放 `src/modules/{module}/stores/`，全域狀態放 `src/shared/stores/`。
- 只有全站共用、跨多個 module 使用的程式碼才放 `shared/`。
- 單一模組使用的 composable、constant、component、style 或 helper，不要放到 `shared/`。
- `src/styles/` 只放全域樣式，不放頁面或元件樣式。

## 模組邊界

建議依照以下依賴方向：

```text
app
  -> router
  -> layouts
  -> modules
  -> shared

modules
  -> shared

shared
  -> 不依賴 modules
```

原則：

- 模組之間避免直接互相引用內部實作。
- 若多個模組需要同一段邏輯，優先抽到 `shared`。
- 若只是某模組專用，不放到 `shared`。
- route name 統一從 `src/shared/constants/routes.js` 使用，避免硬編碼字串散落。

目前例外：

- `home` 會使用 `product` 的 `ProductCard` 與 product store 顯示精選商品。
- `product` 會使用 `cart` store 加入購物車。
- `checkout` 會使用 `cart` store 建立訂單後清空購物車。

這些屬於電商流程中的自然依賴；若未來模組變大，可再抽出 `catalog` 或 `commerce` shared service 來降低跨模組依賴。

## 狀態管理

Pinia store 分成兩類：

- 模組 store：放在 `src/modules/{module}/stores/`。
- 全域 store：放在 `src/shared/stores/`。

目前 store：

- `productStore.js`：商品列表、分類篩選、精選商品。
- `cartStore.js`：購物車品項、數量、小計、localStorage 持久化。
- `authStore.js`：登入 session 與 token 存取。
- `uiStore.js`：全域 loading 與 modal 狀態。
- `appStore.js`：app 初始化與語系狀態。

Store 應負責狀態與狀態變更，不應承擔太多畫面呈現邏輯。

## API 存取

HTTP 共用設定集中在 `src/shared/api/httpClient.js`。

業務 API 放在各模組自己的 `api/` 目錄，例如：

- `src/modules/product/api/productApi.js`
- `src/modules/checkout/api/checkoutApi.js`
- `src/modules/order/api/orderApi.js`
- `src/modules/auth/api/authApi.js`
- `src/modules/member/api/memberApi.js`

目前開發模式使用 mock data：

```js
if (import.meta.env.DEV) {
  return Promise.resolve(mockData);
}
```

正式串接後端時，可以保留同一個 API function 介面，只替換內部 HTTP endpoint。

## 路由與版型

目前路由分為三個 layout group：

- `/`：前台主要頁面，使用 `DefaultLayout`。
- `/checkout`：結帳流程，使用 `CheckoutLayout`。
- `/auth`：登入流程，使用 `AuthLayout`。

主要路徑：

- `/`：首頁
- `/products`：商品列表
- `/products/:id`：商品明細
- `/cart`：購物車
- `/checkout/info`：收件資料
- `/checkout/payment`：付款方式
- `/checkout/complete`：訂單完成
- `/orders`：訂單列表
- `/orders/:id`：訂單明細
- `/auth/login`：登入
- `/auth/line/callback`：LINE callback
- `/member/profile`：會員資料
- `/member/addresses`：常用地址

## 新增功能流程

新增一個業務功能時，建議流程：

1. 在 `src/modules/` 建立新模組資料夾。
2. 建立 `pages/`，放 route 對應頁面。
3. 視需求建立 `components/`、`api/`、`stores/`。
4. 建立模組自己的 `routes.js`。
5. 在 `src/shared/constants/routes.js` 補 route name。
6. 在 `src/router/index.js` 匯入模組 routes。
7. 將畫面文字補到 `locales`。

## 命名約定

- Vue component 使用 PascalCase，例如 `ProductCard.vue`。
- composable 使用 `useXxx.js`，例如 `useLoading.js`。
- Pinia store 使用 `xxxStore.js`，匯出 `useXxxStore`。
- API 檔案使用 `xxxApi.js`。
- route name 統一使用 `ROUTE_NAMES`。
- 共用工具應盡量維持純函式，避免直接讀寫 UI 狀態。

## 環境變數

目前預留環境變數：

- `VITE_API_BASE_URL`：後端 API base URL，預設 `/api`。
- `VITE_LINE_CLIENT_ID`：LINE Login channel client id。

Vite 只會暴露 `VITE_` 前綴的變數給前端使用。

## 建置與啟動

```bash
npm install
npm run dev
npm run build
npm run preview
```

本機開發預設使用 Vite dev server。若預設 port 被占用，可以指定其他 port：

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

## 後續建議

- 補上 ESLint 與 Prettier，固定程式碼風格。
- 加入 Vitest，針對 utils、stores 與 API adapter 撰寫單元測試。
- 加入 Playwright 或 Cypress，覆蓋購物車與結帳主流程。
- 將 mock data 集中到 `mock/` 或 MSW，讓開發資料更容易維護。
- 串接實際後端後，補上 token interceptor 與錯誤處理策略。
