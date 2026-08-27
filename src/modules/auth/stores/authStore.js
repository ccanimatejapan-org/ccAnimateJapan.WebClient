import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ensureLiffReady, getAccessToken, isLiffConfigured, isLoggedIn } from '@/shared/composables/liffClient';
import { getStorageItem, removeStorageItem, setStorageItem } from '@/shared/utils/storage';
import { devLogin, loginWithLiff } from '../api/authApi';

const AUTH_STORAGE_KEY = 'ccAnimateJapan.auth';

export const useAuthStore = defineStore('auth', () => {
  const session = ref(getStorageItem(AUTH_STORAGE_KEY, null));

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
    signInWithDev,
    signOut
  };
});
