import { defineStore } from 'pinia';

let toastTimer;

export const useUiStore = defineStore('ui', {
  state: () => ({
    isGlobalLoading: false,
    modal: null,
    toast: null
  }),
  actions: {
    setGlobalLoading(value) {
      this.isGlobalLoading = value;
    },
    openModal(payload) {
      this.modal = payload;
    },
    closeModal() {
      this.modal = null;
    },
    showToast(payload) {
      window.clearTimeout(toastTimer);
      this.toast = payload;
      toastTimer = window.setTimeout(() => {
        this.toast = null;
      }, payload.duration ?? 3200);
    },
    hideToast() {
      window.clearTimeout(toastTimer);
      this.toast = null;
    }
  }
});
