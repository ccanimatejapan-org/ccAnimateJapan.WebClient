import { ROUTE_NAMES } from '@/shared/constants/routes';
import MemberCenterPage from './pages/MemberCenterPage.vue';

export default [
  {
    path: 'member/profile',
    name: ROUTE_NAMES.MEMBER_PROFILE,
    component: MemberCenterPage
  },
  {
    path: 'member/addresses',
    name: ROUTE_NAMES.MEMBER_ADDRESS_BOOK,
    component: MemberCenterPage
  }
];
