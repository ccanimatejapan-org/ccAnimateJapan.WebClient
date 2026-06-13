import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import homeRoutes from '@/modules/home/routes';
import productRoutes from '@/modules/product/routes';
import activityRoutes from '@/modules/activity/routes';
import cartRoutes from '@/modules/cart/routes';
import checkoutRoutes from '@/modules/checkout/routes';
import orderRoutes from '@/modules/order/routes';
import authRoutes from '@/modules/auth/routes';
import memberRoutes from '@/modules/member/routes';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { getStorageItem } from '@/shared/utils/storage';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useUiStore } from '@/shared/stores/uiStore';
import {
  ensureLiffReady,
  getAccessToken,
  getFriendFlag,
  isLiffConfigured,
  isLoggedIn,
  login as liffLogin
} from '@/shared/composables/liffClient';

const AUTH_STORAGE_KEY = 'ccAnimateJapan.auth';
const PUBLIC_ROUTE_NAMES = new Set([
  ROUTE_NAMES.LOGIN,
  ROUTE_NAMES.LINE_CALLBACK,
  ROUTE_NAMES.LINE_ADD_FRIEND
]);

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      ...homeRoutes,
      ...productRoutes,
      ...activityRoutes,
      ...cartRoutes,
      ...checkoutRoutes,
      ...orderRoutes,
      ...memberRoutes
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: authRoutes
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 96,
        behavior: 'smooth'
      };
    }

    return { top: 0 };
  }
});

// Entering the shop requires a LINE login (and friendship). The whole LIFF flow
// lives here so it works no matter which route the LIFF endpoint opens.
router.beforeEach(async (to) => {
  if (PUBLIC_ROUTE_NAMES.has(to.name)) return true;

  const auth = useAuthStore();
  if (auth.isSessionValid()) return true;

  // Dev only：本地略過 LINE/LIFF（callback URL 設定在正式環境），改向後端 Development-only 的
  // POST /auth/dev-login 取 DB 第一筆會員的真實 session 直接進站。整段被包在
  // import.meta.env.DEV 內，正式 build 會被 tree-shake 移除；後端非 Development 也回 404。
  if (import.meta.env.DEV && import.meta.env.VITE_DEV_AUTO_LOGIN === 'true') {
    try {
      await auth.signInWithDev();
      return true;
    } catch {
      return { name: ROUTE_NAMES.LOGIN, query: { error: 'devlogin' } };
    }
  }

  // No session yet: drive the LIFF login flow. Degrade to the login page if LIFF
  // isn't configured (e.g. VITE_LIFF_ID empty) instead of crashing.
  if (!isLiffConfigured()) return { name: ROUTE_NAMES.LOGIN };

  const ui = useUiStore();
  ui.setGlobalLoading(true);
  try {
    await ensureLiffReady();

    // Inside LINE, liff.init() has already logged the user in. In an external
    // browser we redirect to LINE login and return to the same URL.
    if (!isLoggedIn()) {
      liffLogin(window.location.origin + to.fullPath);
      return false;
    }

    if (!(await getFriendFlag())) {
      return { name: ROUTE_NAMES.LINE_ADD_FRIEND };
    }

    await auth.signInWithLiff(getAccessToken());
    return true;
  } catch (error) {
    if (error?.message === 'notFriend') {
      return { name: ROUTE_NAMES.LINE_ADD_FRIEND };
    }
    return { name: ROUTE_NAMES.LOGIN, query: { error: 'liff' } };
  } finally {
    ui.setGlobalLoading(false);
  }
});
