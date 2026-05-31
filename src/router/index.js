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
