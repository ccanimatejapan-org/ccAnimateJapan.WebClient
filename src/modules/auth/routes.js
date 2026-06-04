import { ROUTE_NAMES } from '@/shared/constants/routes';
import LoginPage from './pages/LoginPage.vue';
import LineCallbackPage from './pages/LineCallbackPage.vue';
import AddFriendPage from './pages/AddFriendPage.vue';

export default [
  {
    path: '',
    redirect: { name: ROUTE_NAMES.LOGIN }
  },
  {
    path: 'login',
    name: ROUTE_NAMES.LOGIN,
    component: LoginPage
  },
  {
    path: 'line/callback',
    name: ROUTE_NAMES.LINE_CALLBACK,
    component: LineCallbackPage
  },
  {
    path: 'add-friend',
    name: ROUTE_NAMES.LINE_ADD_FRIEND,
    component: AddFriendPage
  }
];
