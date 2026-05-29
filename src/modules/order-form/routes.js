import { ROUTE_NAMES } from '@/shared/constants/routes';
import OrderFormPage from './pages/OrderFormPage.vue';

export default [
  {
    path: '/activity/:activityId',
    name: ROUTE_NAMES.ORDER_FORM,
    component: OrderFormPage,
    props: true
  }
];
