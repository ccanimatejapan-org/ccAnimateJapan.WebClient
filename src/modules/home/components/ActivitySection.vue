<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('home.featuredEyebrow') }}</p>
        <h2>{{ t('home.featuredTitle') }}</h2>
      </div>
    </div>

    <AppLoading v-if="activityStore.isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="activityStore.error" :message="t('activity.loadFailed')" />
    <AppEmpty
      v-else-if="activityStore.featuredActivities.length === 0"
      :message="t('activity.empty')"
    />
    <div v-else class="activity-grid">
      <article
        v-for="activity in activityStore.featuredActivities"
        :key="activity.id"
        class="activity-card"
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
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';

const { locale, t } = useI18n();
const activityStore = useActivityStore();

onMounted(() => {
  if (!activityStore.isLoaded) {
    activityStore.fetchActivities();
  }
});

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
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
@use '../styles/activity-section';
</style>
