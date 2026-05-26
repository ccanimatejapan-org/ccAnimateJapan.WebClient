import { ROUTE_NAMES } from '@/shared/constants/routes';
import ProductListPage from './pages/ProductListPage.vue';
import ProductDetailPage from './pages/ProductDetailPage.vue';

export default [
  {
    path: 'products',
    name: ROUTE_NAMES.PRODUCT_LIST,
    component: ProductListPage
  },
  {
    path: 'products/:id',
    name: ROUTE_NAMES.PRODUCT_DETAIL,
    component: ProductDetailPage,
    props: true
  }
];
