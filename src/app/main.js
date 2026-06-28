import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { pinia } from './pinia';
import { i18n } from './i18n';
import { getInitialLocale, applyHtmlLang } from '@/shared/constants/locales';
import { installVersionGuard } from '@/shared/version/versionGuard';
import { ensureServerAwake } from '@/shared/api/httpClient';
import '@/styles/index.scss';
import '@/shared/styles/index.scss';

applyHtmlLang(getInitialLocale());

createApp(App).use(pinia).use(router).use(i18n).mount('#app');

installVersionGuard(router);

if (import.meta.env.PROD) {
  ensureServerAwake().catch(() => {});
}
