import { ROUTE_NAMES } from '@/shared/constants/routes';
import CheckoutPage from './pages/CheckoutPage.vue';

export default [
  {
    path: 'checkout',
    name: ROUTE_NAMES.CHECKOUT,
    component: CheckoutPage
  }
];
