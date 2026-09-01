import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ensureLiffReady, getAccessToken, isLiffConfigured, isLoggedIn } from '@/shared/composables/liffClient';
import { getStorageItem, removeStorageItem, setStorageItem } from '@/shared/utils/storage';
import { devLogin, loginWithLiff } from '../api/authApi';

const AUTH_STORAGE_KEY = 'ccAnimateJapan.auth';
// 背景刷新 LINE profile（displayName / pictureUrl）的最短間隔，避免 SPA 換頁狂打 LINE API。
const PROFILE_REFRESH_INTERVAL_MS = 10 * 60_000;

export const useAuthStore = defineStore('auth', () => {
  const session = ref(getStorageItem(AUTH_STORAGE_KEY, null));
  let lastProfileRefreshAt = 0;

  async function resetMemberScopedStores() {
    const [{ useCartStore }, { useProductStore }, { useActivityStore }] = await Promise.all([
      import('@/modules/cart/stores/cartStore'),
      import('@/modules/product/stores/productStore'),
      import('@/modules/activity/stores/activityStore')
    ]);
    useCartStore().clearCart();
    useProductStore().reset();
    useActivityStore().reset();
  }

  async function signInWithLiff(accessToken) {
    session.value = await loginWithLiff(accessToken);
    setStorageItem(AUTH_STORAGE_KEY, session.value);
  }

  function isSessionValid() {
    const expiresAt = Date.parse(session.value?.expiresAt);
    return Boolean(session.value?.accessToken && Number.isFinite(expiresAt) && expiresAt - 60_000 > Date.now());
  }

  async function renewSession() {
    try {
      if (!isLiffConfigured()) return false;
      await ensureLiffReady();
      if (!isLoggedIn()) return false;
      await signInWithLiff(getAccessToken());
      return true;
    } catch {
      return false;
    }
  }

  // 進站時在背景把 members 的 displayName / pictureUrl 同步成 LINE 最新值。
  // JWT 沒過期時 guard 不會重新登入，DB 會停在舊資料（例如換過頭像後，DB 存的舊網址會 404）；
  // 這裡沿用 renewSession（ensureLiffReady + 重打 /auth/line/login 觸發後端 upsert），
  // 節流成每 PROFILE_REFRESH_INTERVAL_MS 一次，不阻塞導頁、失敗也不影響現有 session。
  function refreshProfileInBackground() {
    if (!isSessionValid()) return;
    const now = Date.now();
    if (now - lastProfileRefreshAt < PROFILE_REFRESH_INTERVAL_MS) return;
    lastProfileRefreshAt = now;
    void renewSession();
  }

  // 僅本地開發使用（見 router guard 的 import.meta.env.DEV + VITE_DEV_AUTO_LOGIN 分支）。
  async function signInWithDev() {
    session.value = await devLogin();
    setStorageItem(AUTH_STORAGE_KEY, session.value);
  }

  function signOut() {
    session.value = null;
    removeStorageItem(AUTH_STORAGE_KEY);
    resetMemberScopedStores().catch(() => {});
  }

  return {
    session,
    signInWithLiff,
    isSessionValid,
    renewSession,
    refreshProfileInBackground,
    signInWithDev,
    signOut
  };
});
