import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getStorageItem, removeStorageItem, setStorageItem } from '@/shared/utils/storage';
import { login, loginWithLiff } from '../api/authApi';

const AUTH_STORAGE_KEY = 'ccAnimateJapan.auth';

export const useAuthStore = defineStore('auth', () => {
  const session = ref(getStorageItem(AUTH_STORAGE_KEY, null));

  async function signIn(payload) {
    session.value = await login(payload);
    setStorageItem(AUTH_STORAGE_KEY, session.value);
  }

  async function signInWithLiff(accessToken) {
    session.value = await loginWithLiff(accessToken);
    setStorageItem(AUTH_STORAGE_KEY, session.value);
  }

  function signOut() {
    session.value = null;
    removeStorageItem(AUTH_STORAGE_KEY);
  }

  return {
    session,
    signIn,
    signInWithLiff,
    signOut
  };
});
