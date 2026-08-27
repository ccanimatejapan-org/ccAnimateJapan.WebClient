import { ref } from 'vue';

export function useAddressBook({ getAddresses, createAddress, updateAddress, setDefaultAddress, deleteAddress }) {
  const addresses = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const isMutating = ref(false);
  let requestSequence = 0;
  async function reload() {
    const sequence = ++requestSequence;
    isLoading.value = true;
    error.value = null;
    try {
      const result = await getAddresses();
      if (sequence === requestSequence) addresses.value = result;
      return sequence === requestSequence;
    } catch (err) {
      if (sequence === requestSequence) error.value = err;
      throw err;
    } finally {
      if (sequence === requestSequence) isLoading.value = false;
    }
  }
  async function mutate(action) {
    if (isMutating.value) return false;
    isMutating.value = true;
    requestSequence += 1;
    try {
      await action();
      // The write already succeeded on the server. A failed refresh must NOT be
      // reported as a mutation failure — that would prompt the user to retry and
      // create a duplicate. The list reconciles on the next reload.
      try {
        await reload();
      } catch {
        error.value = null;
      }
      return true;
    } finally { isMutating.value = false; }
  }
  return {
    addresses, isLoading, error, isMutating, reload,
    save: (editingId, payload) => mutate(() => editingId ? updateAddress(editingId, payload) : createAddress(payload)),
    makeDefault: (id) => mutate(() => setDefaultAddress(id)),
    remove: (id) => mutate(() => deleteAddress(id))
  };
}
