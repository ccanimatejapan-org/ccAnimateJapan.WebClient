<template>
  <section v-if="animateTypes.length" class="home-works">
    <div class="home-works__head">
      <h2 class="home-works__title">{{ t('home.animateType.title') }}</h2>
      <RouterLink class="home-works__more" :to="{ name: ROUTE_NAMES.WORK_LIST }">
        {{ t('home.animateType.viewAll') }} ›
      </RouterLink>
    </div>

    <div class="home-works__row">
      <RouterLink
        v-for="work in animateTypes"
        :key="work.id"
        class="home-works__chip"
        :to="{ name: ROUTE_NAMES.WORK_ACTIVITIES, params: { animateTypeId: work.id } }"
      >
        <span class="home-works__circle">{{ work.name }}</span>
        <span class="home-works__count">{{ t('home.workCount', { count: work.count }) }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const { t } = useI18n();
const activityStore = useActivityStore();
const { animateTypes } = storeToRefs(activityStore);
</script>

<style scoped lang="scss">
@use '../styles/home-works';
</style>
