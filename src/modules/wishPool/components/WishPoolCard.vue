<template>
  <article class="wish-pool-card">
    <div class="wish-pool-card__image-wrap">
      <img v-if="item.productImageUrl" class="wish-pool-card__image" :src="item.productImageUrl" :alt="item.activityName" />
      <span v-else class="wish-pool-card__image-empty">{{ t('wishPool.card.imageEmpty') }}</span>
    </div>
    <div class="wish-pool-card__body">
      <div class="wish-pool-card__heading">
        <span class="wish-pool-card__animate-type">{{ item.animateTypeName }}</span>
        <span class="wish-pool-card__decision" :class="`wish-pool-card__decision--${decisionMeta.variant}`">
          {{ t(decisionMeta.key) }}
        </span>
      </div>
      <h2>{{ item.activityName }}</h2>
      <a v-if="safeProductUrl" :href="safeProductUrl" target="_blank" rel="noopener noreferrer">
        {{ t('wishPool.card.viewProduct') }}
      </a>
      <span class="wish-pool-card__date">{{ formattedDate }}</span>
    </div>
    <button
      type="button"
      class="wish-pool-card__heart"
      :class="{ 'is-active': item.hasReacted === true }"
      :disabled="!canReact || reactionPending"
      :aria-pressed="item.hasReacted === true"
      :aria-label="t('wishPool.reaction.support')"
      @click="onReactionClick"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          :fill="item.hasReacted ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </svg>
      <span class="wish-pool-card__heart-count">{{ item.reactionCount }}</span>
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDateTime } from '@/shared/utils/date';
import { canToggleReaction, getGroupBuyDecisionMeta, isValidProductUrl } from '../utils/wishPoolRules';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  reactionPending: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['react']);
const { t, locale } = useI18n();
const decisionMeta = computed(() => getGroupBuyDecisionMeta(props.item.groupBuyDecision));
const safeProductUrl = computed(() => {
  const value = typeof props.item.productUrl === 'string' ? props.item.productUrl.trim() : '';
  return isValidProductUrl(value) && value ? value : '';
});
const formattedDate = computed(() => formatDateTime(props.item.createdAt, locale.value));
const canReact = computed(() => props.item.canReact === true);

function onReactionClick() {
  if (!canToggleReaction(props.item, props.reactionPending)) return;
  emit('react', props.item.id);
}
</script>

<style scoped lang="scss">
@use '../styles/wish-pool-card';
</style>
