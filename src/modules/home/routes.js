import { ROUTE_NAMES } from '@/shared/constants/routes';
import HomePage from './pages/HomePage.vue';

export default [
  {
    path: '',
    name: ROUTE_NAMES.HOME,
    component: HomePage
  }
];
