import axios from 'axios';
import { getStorageItem, removeStorageItem } from '@/shared/utils/storage';

const AUTH_STORAGE_KEY = 'ccAnimateJapan.auth';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the LINE-issued JWT (if logged in) so the backend resolves the real member.
// Without a (valid) token the backend's protected endpoints return 401 (handled below).
httpClient.interceptors.request.use((config) => {
  const session = getStorageItem(AUTH_STORAGE_KEY, null);
  const token = session?.accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error?.response?.status === 401) {
      // 401 means the token is expired/invalid OR its member was deleted/disabled in the DB.
      // Drop the stale session and send the user back through login so the LINE flow
      // re-creates the member. Dynamic imports avoid the httpClient<->authStore import cycle.
      removeStorageItem(AUTH_STORAGE_KEY);
      try {
        const [{ useAuthStore }, { router }, { ROUTE_NAMES }] = await Promise.all([
          import('@/modules/auth/stores/authStore'),
          import('@/app/router'),
          import('@/shared/constants/routes')
        ]);
        useAuthStore().signOut();
        if (router.currentRoute.value.name !== ROUTE_NAMES.LOGIN) {
          await router.replace({ name: ROUTE_NAMES.LOGIN, query: { error: 'session' } });
        }
      } catch {
        window.location.assign('/auth/login');
      }
    }
    return Promise.reject(error);
  }
);
