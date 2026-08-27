import { computed, ref } from 'vue';

export function useSingleFlight() {
  const pending = ref(false);
  let pendingPromise = null;

  function run(task) {
    if (pendingPromise) return pendingPromise;
    pending.value = true;
    const current = Promise.resolve().then(task).finally(() => {
      if (pendingPromise === current) {
        pendingPromise = null;
        pending.value = false;
      }
    });
    pendingPromise = current;
    return current;
  }

  return { isPending: computed(() => pending.value), run };
}
