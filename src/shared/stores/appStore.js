import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    locale: 'zh-TW',
    initialized: false
  }),
  actions: {
    initialize() {
      this.initialized = true;
    },
    setLocale(locale) {
      this.locale = locale;
    }
  }
});
