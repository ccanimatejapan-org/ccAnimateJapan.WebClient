<template>
  <section class="home-ending-soon">
    <div class="home-ending-soon__head">
      <h2 class="home-ending-soon__title">
        <svg class="home-ending-soon__title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2" />
          <path d="M5 3 2 6" />
          <path d="m22 6-3-3" />
          <path d="M6.38 18.7 4 21" />
          <path d="M17.64 18.67 20 21" />
        </svg>
        {{ t('home.endingSoon.title') }}
      </h2>
      <RouterLink class="home-ending-soon__more" :to="{ name: ROUTE_NAMES.ACTIVITY_LIST }">
        {{ t('home.endingSoon.viewAll') }} ›
      </RouterLink>
    </div>

    <AppLoading v-if="loading" :label="t('common.loading')" />
    <AppEmpty v-else-if="!activities.length" :message="t('activity.empty')" />
    <AppCarousel v-else :gap="12">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="home-ending-soon__item"
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
@use '../styles/home-ending-soon';
</style>
