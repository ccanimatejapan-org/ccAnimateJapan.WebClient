<template>
  <RouterLink
    class="activity-card"
    :to="{ name: ROUTE_NAMES.ACTIVITY_PRODUCTS, params: { activityId: activity.id } }"
  >
    <img
      v-if="activity.imageUrl"
      :src="activity.imageUrl"
      :alt="activity.name || t('activity.unnamed')"
      loading="lazy"
    />
    <div v-else class="activity-card__placeholder" aria-hidden="true" />

    <div class="activity-card__body">
      <div class="activity-card__topline">
        <p>{{ formatDateRange(activity) }}</p>
        <span v-if="activity.isPreOrder">{{ t('activity.preOrder') }}</span>
      </div>
      <h3>{{ activity.name || t('activity.unnamed') }}</h3>
      <p v-if="activity.address" class="activity-card__address">
        {{ activity.address }}
      </p>
      <p v-if="activity.info" class="activity-card__info">
        {{ activity.info }}
      </p>
      <span class="activity-card__action">{{ t('activity.viewProducts') }}</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';

defineProps({
  activity: {
    type: Object,
    required: true
  }
});

const { locale, t } = useI18n();

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale.value, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatDateRange(activity) {
  const start = formatDate(activity.activeStartTime);
  const end = formatDate(activity.activeEndTime);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;

  return t('activity.datePending');
}
</script>

<style scoped lang="scss">
@use '../styles/activity-card';
</style>
