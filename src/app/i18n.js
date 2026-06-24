import { createI18n } from 'vue-i18n';
import zhTW from '@/locales/zh-TW.json';
import en from '@/locales/en.json';
import { getInitialLocale } from '@/shared/constants/locales';

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    'zh-TW': zhTW,
    en
  }
});
