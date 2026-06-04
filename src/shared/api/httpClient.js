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
// Without a token the backend falls back to DevAuth:DefaultMemberId.
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
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired/invalid — drop it so subsequent requests aren't rejected.
      removeStorageItem(AUTH_STORAGE_KEY);
    }
    return Promise.reject(error);
  }
);
