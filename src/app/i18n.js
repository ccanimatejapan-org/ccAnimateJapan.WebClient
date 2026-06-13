import { createI18n } from 'vue-i18n';
import zhTW from '@/locales/zh-TW.json';
import en from '@/locales/en.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    'zh-TW': zhTW,
    en
  }
});
