import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isGlobalLoading: false,
    modal: null
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
    }
  }
});
