import axios from 'axios';
import { getStorageItem, removeStorageItem } from '@/shared/utils/storage';
import { isLiffConfigured } from '@/shared/composables/liffClient';
import { ApiResponseError } from './apiResponse';

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

let renewPromise = null;

async function renewSessionOnce(authStore) {
  const pendingRenew = renewPromise || authStore.renewSession();
  renewPromise = pendingRenew;
  try {
    return await pendingRenew;
  } finally {
    if (renewPromise === pendingRenew) {
      renewPromise = null;
    }
  }
}

async function dropSessionAndRedirect() {
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

// Dynamic imports avoid the httpClient<->authStore import cycle.
async function handleUnauthorized(config) {
  if (config && !config._retried) {
    try {
      if (isLiffConfigured()) {
        const { useAuthStore } = await import('@/modules/auth/stores/authStore');
        const renewed = await renewSessionOnce(useAuthStore());
        if (renewed) {
          config._retried = true;
          return await httpClient(config);
        }
      }
    } catch {
      renewPromise = null;
    }
  }
  await dropSessionAndRedirect();
  return null;
}

httpClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (!response.config?.skipAuthHandling && body && typeof body === 'object' && body.status === '401') {
      return handleUnauthorized(response.config).then((retried) => {
        if (retried) return retried;
        throw new ApiResponseError(body.message || 'Unauthorized', '401');
      });
    }
    return body;
  },
  async (error) => {
    if (error?.response?.status === 401 && !error.config?.skipAuthHandling) {
      const retried = await handleUnauthorized(error.config);
      if (retried) return retried;
    }
    return Promise.reject(error);
  }
);

const HEALTH_PATH = '/db/health';
const WARMUP_FIRST_TIMEOUT = 8000;
const WARMUP_POLL_TIMEOUT = 12000;
const WARMUP_POLL_INTERVAL = 4000;
const WARMUP_TOTAL_BUDGET = 90000;
const WARM_CACHE_MS = 60000;

let warmUpPromise = null;
let lastWarmAt = 0;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function pingHealth(timeout) {
  return httpClient.get(HEALTH_PATH, { skipAuthHandling: true, timeout });
}

export async function ensureServerAwake() {
  if (lastWarmAt && Date.now() - lastWarmAt < WARM_CACHE_MS) return true;
  if (warmUpPromise) return warmUpPromise;

  warmUpPromise = (async () => {
    try {
      await pingHealth(WARMUP_FIRST_TIMEOUT);
      lastWarmAt = Date.now();
      return true;
    } catch {}

    const deadline = Date.now() + WARMUP_TOTAL_BUDGET;
    while (Date.now() < deadline) {
      await delay(WARMUP_POLL_INTERVAL);
      try {
        await pingHealth(WARMUP_POLL_TIMEOUT);
        lastWarmAt = Date.now();
        return true;
      } catch {}
    }
    return false;
  })();

  try {
    return await warmUpPromise;
  } finally {
    warmUpPromise = null;
  }
}
