<template>
  <RouterLink
    class="home-activity-card"
    :class="`home-activity-card--${variant}`"
    :to="{ name: ROUTE_NAMES.ACTIVITY_PRODUCTS, params: { activityId: activity.id } }"
  >
    <div class="home-activity-card__media">
      <img
        v-if="activity.imageUrl"
        :src="activity.imageUrl"
        :alt="activity.name || t('activity.unnamed')"
        loading="lazy"
      />
      <div v-else class="home-activity-card__placeholder" aria-hidden="true" />
      <span
        v-if="rank"
        class="home-activity-card__rank"
        :aria-label="t('home.popular.rank', { rank })"
      >
        <svg class="home-activity-card__rank-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </svg>
        <span class="home-activity-card__rank-num">{{ rank }}</span>
      </span>
      <span
        class="home-activity-card__badge"
        :class="[badgeClass, { 'home-activity-card__badge--right': rank }]"
      >
        {{ badgeLabel }}
      </span>
    </div>

    <div class="home-activity-card__body">
      <span v-if="activity.animateTypeName" class="home-activity-card__work">
        {{ activity.animateTypeName }}
      </span>
      <h3 class="home-activity-card__name">{{ activity.name || t('activity.unnamed') }}</h3>
      <p class="home-activity-card__date">{{ dateRange }}</p>
      <span class="home-activity-card__action">{{ t('home.viewProducts') }} ›</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const props = defineProps({
  activity: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'compact'
  },
  rank: {
    type: Number,
    default: 0
  }
});

const { locale, t } = useI18n();

const ACTIVITY_STATUS_ENDED = 4;
const isEnded = computed(() => props.activity.status === ACTIVITY_STATUS_ENDED);

const badgeLabel = computed(() => {
  if (isEnded.value) return t('home.badge.ended');
  return props.activity.isPreOrder ? t('home.badge.preOrder') : t('home.badge.inStock');
});

const badgeClass = computed(() => {
  if (isEnded.value) return 'home-activity-card__badge--ended';
  return props.activity.isPreOrder
    ? 'home-activity-card__badge--preorder'
    : 'home-activity-card__badge--instock';
});

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale.value, {
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

const dateRange = computed(() => {
  const start = formatDate(props.activity.activeStartTime);
  const end = formatDate(props.activity.activeEndTime);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;

  return t('activity.datePending');
});
</script>

<style scoped lang="scss">
@use '../styles/home-activity-card';
</style>
