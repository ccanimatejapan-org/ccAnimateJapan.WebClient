import { ROUTE_NAMES } from '@/shared/constants/routes';
import CheckoutInfoPage from './pages/CheckoutInfoPage.vue';
import CheckoutPaymentPage from './pages/CheckoutPaymentPage.vue';
import CheckoutCompletePage from './pages/CheckoutCompletePage.vue';

export default [
  {
    path: '',
    redirect: { name: ROUTE_NAMES.CHECKOUT_INFO }
  },
  {
    path: 'info',
    name: ROUTE_NAMES.CHECKOUT_INFO,
    component: CheckoutInfoPage
  },
  {
    path: 'payment',
    name: ROUTE_NAMES.CHECKOUT_PAYMENT,
    component: CheckoutPaymentPage
  },
  {
    path: 'complete',
    name: ROUTE_NAMES.CHECKOUT_COMPLETE,
    component: CheckoutCompletePage
  }
];
