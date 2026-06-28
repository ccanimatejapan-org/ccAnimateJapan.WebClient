<template>
  <section id="activities" class="home-ongoing">
    <div class="home-ongoing__head">
      <h2 class="home-ongoing__title">
        <svg class="home-ongoing__title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
        {{ t('home.ongoing.title') }}
      </h2>
      <RouterLink class="home-ongoing__more" :to="{ name: ROUTE_NAMES.ACTIVITY_LIST }">
        {{ t('home.ongoing.viewAll') }} ›
      </RouterLink>
    </div>

    <AppLoading v-if="loading" :label="t('common.loading')" />
    <AppEmpty v-else-if="!activities.length" :message="t('activity.empty')" />
    <AppCarousel v-else :gap="12">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="home-ongoing__item"
      >
        <HomeActivityCard :activity="activity" variant="compact" />
      </div>
    </AppCarousel>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import AppCarousel from '@/shared/components/AppCarousel.vue';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import HomeActivityCard from './HomeActivityCard.vue';

defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/home-ongoing';
</style>
