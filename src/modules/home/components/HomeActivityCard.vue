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
        {{ rank }}
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
