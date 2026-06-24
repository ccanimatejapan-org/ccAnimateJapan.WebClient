import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/shared/stores/appStore';
import { setStorageItem } from '@/shared/utils/storage';
import {
  SUPPORTED_LOCALES,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  applyHtmlLang
} from '@/shared/constants/locales';

export function useLocale() {
  const { locale } = useI18n();
  const appStore = useAppStore();

  // Reconcile the Pinia store with the active i18n locale on first use.
  if (appStore.locale !== locale.value) {
    appStore.setLocale(locale.value);
  }

  const current = computed(() => locale.value);

  function isActive(code) {
    return locale.value === code;
  }

  function change(next) {
    const normalized = normalizeLocale(next);
    if (locale.value !== normalized) {
      locale.value = normalized;
    }
    appStore.setLocale(normalized);
    setStorageItem(LOCALE_STORAGE_KEY, normalized);
    applyHtmlLang(normalized);
  }

  return { current, locales: SUPPORTED_LOCALES, isActive, change };
}
