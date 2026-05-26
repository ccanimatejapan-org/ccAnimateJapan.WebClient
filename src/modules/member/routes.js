import { ROUTE_NAMES } from '@/shared/constants/routes';
import ProfilePage from './pages/ProfilePage.vue';
import AddressBookPage from './pages/AddressBookPage.vue';

export default [
  {
    path: 'member/profile',
    name: ROUTE_NAMES.MEMBER_PROFILE,
    component: ProfilePage
  },
  {
    path: 'member/addresses',
    name: ROUTE_NAMES.MEMBER_ADDRESS_BOOK,
    component: AddressBookPage
  }
];
