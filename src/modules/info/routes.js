import { ROUTE_NAMES } from '@/shared/constants/routes';
import PurchaseNoticePage from './pages/PurchaseNoticePage.vue';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.vue';
import TermsPage from './pages/TermsPage.vue';
import UserGuidePage from './pages/UserGuidePage.vue';

export default [
  {
    path: 'purchase-notice',
    name: ROUTE_NAMES.PURCHASE_NOTICE,
    component: PurchaseNoticePage
  },
  {
    path: 'privacy',
    name: ROUTE_NAMES.PRIVACY_POLICY,
    component: PrivacyPolicyPage
  },
  {
    path: 'terms',
    name: ROUTE_NAMES.TERMS,
    component: TermsPage
  },
  {
    path: 'guide',
    name: ROUTE_NAMES.USER_GUIDE,
    component: UserGuidePage
  }
];
