import { ROUTE_NAMES } from '@/shared/constants/routes';
import OrderListPage from './pages/OrderListPage.vue';
import OrderDetailPage from './pages/OrderDetailPage.vue';

export default [
  {
    path: 'orders',
    name: ROUTE_NAMES.ORDER_LIST,
    component: OrderListPage
  },
  {
    path: 'orders/:id',
    name: ROUTE_NAMES.ORDER_DETAIL,
    component: OrderDetailPage,
    props: true
  }
];
