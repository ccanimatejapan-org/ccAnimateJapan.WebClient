<template>
  <section id="activities" class="home-ongoing">
    <h2 class="home-ongoing__title">{{ t('home.ongoing.title') }}</h2>

    <AppLoading v-if="loading" :label="t('common.loading')" />
    <AppEmpty v-else-if="!activities.length" :message="t('activity.empty')" />
    <div v-else class="home-ongoing__grid">
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
import { useI18n } from 'vue-i18n';
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
