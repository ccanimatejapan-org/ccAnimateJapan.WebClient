<template>
  <section class="home-ending-soon">
    <div class="home-ending-soon__head">
      <h2 class="home-ending-soon__title">{{ t('home.endingSoon.title') }}</h2>
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
