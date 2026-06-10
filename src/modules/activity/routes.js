import { ROUTE_NAMES } from '@/shared/constants/routes';
import WorkListPage from './pages/WorkListPage.vue';
import WorkActivitiesPage from './pages/WorkActivitiesPage.vue';

export default [
  {
    path: 'works',
    name: ROUTE_NAMES.WORK_LIST,
    component: WorkListPage
  },
  {
    path: 'works/:animateTypeId',
    name: ROUTE_NAMES.WORK_ACTIVITIES,
    component: WorkActivitiesPage,
    props: true
  }
];
