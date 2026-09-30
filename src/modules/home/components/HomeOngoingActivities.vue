<template>
  <section id="activities" class="home-ongoing">
    <div class="section-head">
      <h2>{{ t('home.ongoing.title') }}</h2>
      <RouterLink class="section-head__more" :to="{ name: ROUTE_NAMES.ACTIVITY_LIST }">
        {{ t('home.ongoing.viewAll') }}
        <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" width="15" height="15"><path d="m9 5 7 7-7 7" /></svg>
      </RouterLink>
    </div>

    <AppLoading v-if="loading" :label="t('common.loading')" />
    <AppEmpty v-else-if="!activities.length" :message="t('activity.empty')" />
    <div v-else class="card-grid">
      <HomeActivityCard
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        variant="compact"
      />
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';
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
