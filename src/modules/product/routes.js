import { ROUTE_NAMES } from '@/shared/constants/routes';
import ProductListPage from './pages/ProductListPage.vue';

export default [
  {
    path: 'activities/:activityId/products',
    name: ROUTE_NAMES.ACTIVITY_PRODUCTS,
    component: ProductListPage,
    props: true
  },
  {
    path: 'products',
    name: ROUTE_NAMES.PRODUCT_LIST,
    redirect: { name: ROUTE_NAMES.HOME }
  }
];
