import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { getWishPoolAnimateTypes, getWishPools, createWishPool as createWishPoolApi, toggleWishPoolReaction } from '../api/wishPoolApi';
import { useServerPagination } from '@/shared/composables/useServerPagination';
import { useSingleFlight } from '@/shared/composables/useSingleFlight';
import { canToggleReaction } from '../utils/wishPoolRules';

export const useWishPoolStore = defineStore('wishPool', () => {
  const pagination = useServerPagination((page, pageSize) => getWishPools({ page, pageSize }), 12);
  const animateTypes = ref([]);
  const animateTypesLoading = ref(false);
  const animateTypesLoadFailed = ref(false);
  const animateTypesLoaded = ref(false);
  const reactionPendingIds = reactive(new Set());
  const { isPending: isSubmitting, run: runSubmit } = useSingleFlight();
  let animateTypesRequest = null;

  async function loadAnimateTypes(force = false) {
    if (animateTypesLoaded.value && !force) return animateTypes.value;
    if (animateTypesRequest) return animateTypesRequest;

    animateTypesLoading.value = true;
    animateTypesLoadFailed.value = false;
    animateTypesRequest = getWishPoolAnimateTypes()
      .then((data) => {
        const options = Array.isArray(data) ? data : data?.items;
        animateTypes.value = Array.isArray(options) ? options : [];
        animateTypesLoaded.value = true;
        return animateTypes.value;
      })
      .catch((error) => {
        animateTypesLoadFailed.value = true;
        animateTypesLoaded.value = false;
        animateTypes.value = [];
        throw error;
      })
      .finally(() => {
        animateTypesLoading.value = false;
        animateTypesRequest = null;
      });

    return animateTypesRequest;
  }

  function createWishPool(draft) {
    return runSubmit(() => createWishPoolApi(draft));
  }

  function isReactionPending(id) {
    return reactionPendingIds.has(String(id));
  }

  async function toggleReaction(id) {
    const key = String(id);
    const item = pagination.items.value.find((candidate) => String(candidate?.id) === key);
    if (!canToggleReaction(item, reactionPendingIds.has(key))) return null;

    reactionPendingIds.add(key);
    try {
      const result = await toggleWishPoolReaction(id);
      if (typeof result?.reacted === 'boolean' && Number.isFinite(Number(result?.reactionCount))) {
        const current = pagination.items.value.find((candidate) => String(candidate?.id) === key);
        if (current) {
          current.hasReacted = result.reacted;
          current.reactionCount = Number(result.reactionCount);
        }
      }
      return result;
    } finally {
      reactionPendingIds.delete(key);
    }
  }

  function reset() {
    pagination.reset();
    animateTypes.value = [];
    animateTypesLoading.value = false;
    animateTypesLoadFailed.value = false;
    animateTypesLoaded.value = false;
    reactionPendingIds.clear();
  }

  return {
    ...pagination,
    animateTypes,
    animateTypesLoading,
    animateTypesLoadFailed,
    isSubmitting,
    loadAnimateTypes,
    createWishPool,
    isReactionPending,
    toggleReaction,
    reset
  };
});
