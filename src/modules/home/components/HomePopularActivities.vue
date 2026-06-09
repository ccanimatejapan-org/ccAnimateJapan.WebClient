<template>
  <section v-if="popularActivities.length" class="home-popular">
    <h2 class="home-popular__title">🔥 {{ t('home.popular.title') }}</h2>
    <div class="home-popular__row">
      <div
        v-for="(activity, index) in popularActivities"
        :key="activity.id"
        class="home-popular__item"
      >
        <HomeActivityCard :activity="activity" :rank="index + 1" variant="compact" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import HomeActivityCard from './HomeActivityCard.vue';

const { t } = useI18n();
const activityStore = useActivityStore();
const { popularActivities } = storeToRefs(activityStore);
</script>

<style scoped lang="scss">
@use '../styles/home-popular';
</style>
