import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { pinia } from './pinia';
import { i18n } from './i18n';
import '@/styles/index.scss';
import '@/shared/styles/index.scss';

createApp(App).use(pinia).use(router).use(i18n).mount('#app');
