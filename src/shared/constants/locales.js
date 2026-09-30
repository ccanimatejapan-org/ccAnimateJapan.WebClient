import { getStorageItem } from '../utils/storage.js';

export const SUPPORTED_LOCALES = [
  { code: 'zh-TW', label: '繁中', name: '繁體中文', hint: 'Traditional Chinese' },
  { code: 'en', label: 'EN', name: 'English', hint: '英文' }
];

export const DEFAULT_LOCALE = 'zh-TW';
export const LOCALE_STORAGE_KEY = 'ccAnimateJapan.locale';

export const HTML_LANG_BY_LOCALE = {
  'zh-TW': 'zh-Hant',
  en: 'en'
};

const SUPPORTED_CODES = SUPPORTED_LOCALES.map((item) => item.code);

export function normalizeLocale(value) {
  return SUPPORTED_CODES.includes(value) ? value : DEFAULT_LOCALE;
}

export function htmlLangFor(locale) {
  return HTML_LANG_BY_LOCALE[normalizeLocale(locale)];
}

export function getInitialLocale() {
  return normalizeLocale(getStorageItem(LOCALE_STORAGE_KEY, DEFAULT_LOCALE));
}

export function applyHtmlLang(locale) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = htmlLangFor(locale);
}
