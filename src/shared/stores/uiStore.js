import { defineStore } from 'pinia';

let toastTimer;

export const useUiStore = defineStore('ui', {
  state: () => ({
    isGlobalLoading: false,
    globalLoadingKey: null,
    modal: null,
    toast: null,
    toastQueue: []
  }),
  actions: {
    setGlobalLoading(value, key = null) {
      this.isGlobalLoading = value;
      this.globalLoadingKey = value ? key : null;
    },
    openModal(payload) {
      this.modal = payload;
    },
    closeModal() {
      this.modal = null;
    },
    showToast(payload) {
      if (payload.queue && this.toast) {
        this.toastQueue.push(payload);
        return;
      }
      this.toastQueue = [];
      this.presentToast(payload);
    },
    presentToast(payload) {
      window.clearTimeout(toastTimer);
      this.toast = payload;
      toastTimer = window.setTimeout(() => {
        this.dismissToast();
      }, payload.duration ?? 3200);
    },
    dismissToast() {
      window.clearTimeout(toastTimer);
      this.toast = null;
      const nextToast = this.toastQueue.shift();
      if (nextToast) this.presentToast(nextToast);
    },
    hideToast() {
      this.dismissToast();
    }
  }
});
