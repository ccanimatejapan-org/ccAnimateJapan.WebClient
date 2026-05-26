import { ROUTE_NAMES } from '@/shared/constants/routes';
import CartPage from './pages/CartPage.vue';

export default [
  {
    path: 'cart',
    name: ROUTE_NAMES.CART,
    component: CartPage
  }
];
