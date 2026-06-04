import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import homeRoutes from '@/modules/home/routes';
import productRoutes from '@/modules/product/routes';
import cartRoutes from '@/modules/cart/routes';
import orderFormRoutes from '@/modules/order-form/routes';
import orderRoutes from '@/modules/order/routes';
import authRoutes from '@/modules/auth/routes';
import memberRoutes from '@/modules/member/routes';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { getStorageItem } from '@/shared/utils/storage';
import { shouldUseMockApi } from '@/shared/api/mockMode';

const AUTH_STORAGE_KEY = 'ccAnimateJapan.auth';
const PUBLIC_ROUTE_NAMES = new Set([
  ROUTE_NAMES.LOGIN,
  ROUTE_NAMES.LINE_CALLBACK,
  ROUTE_NAMES.LINE_ADD_FRIEND
]);

const routes = [
  ...orderFormRoutes,
  {
    path: '/',
    component: DefaultLayout,
    children: [
      ...homeRoutes,
      ...productRoutes,
      ...cartRoutes,
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

// Real mode requires a LINE login (and friendship) before entering the shop.
// Mock/demo mode keeps everything open.
router.beforeEach((to) => {
  if (shouldUseMockApi()) return true;
  if (PUBLIC_ROUTE_NAMES.has(to.name)) return true;

  const session = getStorageItem(AUTH_STORAGE_KEY, null);
  if (session?.accessToken) return true;

  return { name: ROUTE_NAMES.LOGIN };
});
