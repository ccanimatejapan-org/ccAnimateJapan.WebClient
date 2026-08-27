import { ref } from 'vue';

export function createCartHydrationCoordinator(fetcher, apply) {
  const isHydrated = ref(false);
  let pendingPromise = null;
  let epoch = 0;

  function start(force = false) {
    if (!force && pendingPromise) return pendingPromise;
    const requestEpoch = ++epoch;
    const current = Promise.resolve()
      .then(fetcher)
      .then((cart) => {
        if (requestEpoch === epoch) {
          apply(cart);
          isHydrated.value = true;
        }
        return cart;
      })
      .catch(() => null)
      .finally(() => {
        if (pendingPromise === current) pendingPromise = null;
      });
    pendingPromise = current;
    return current;
  }

  return {
    isHydrated,
    ensureHydrated: () => (isHydrated.value ? Promise.resolve() : start()),
    hydrate: () => { isHydrated.value = false; return start(true); },
    clear: () => { epoch += 1; pendingPromise = null; isHydrated.value = false; }
  };
}
