import { ref } from 'vue';

export function useLoading(initialValue = false) {
  const isLoading = ref(initialValue);

  async function withLoading(task) {
    isLoading.value = true;
    try {
      return await task();
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    withLoading
  };
}
