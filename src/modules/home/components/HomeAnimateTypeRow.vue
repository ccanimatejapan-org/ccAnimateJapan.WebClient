<template>
  <section v-if="works.length" class="home-works">
    <div class="home-works__head">
      <h2 class="home-works__title">{{ t('home.animateType.title') }}</h2>
      <RouterLink class="home-works__more" :to="{ name: ROUTE_NAMES.WORK_LIST }">
        {{ t('home.animateType.viewAll') }} ›
      </RouterLink>
    </div>

    <AppCarousel :gap="16">
      <RouterLink
        v-for="work in works"
        :key="work.id"
        class="home-works__chip"
        :to="{ name: ROUTE_NAMES.WORK_ACTIVITIES, params: { animateTypeId: work.id } }"
      >
        <span class="home-works__avatar">
          <img
            v-if="work.imageUrl"
            class="home-works__img"
            :src="work.imageUrl"
            :alt="work.name"
            loading="lazy"
          />
          <span v-else class="home-works__fallback">{{ (work.name || '?').slice(0, 1) }}</span>
          <span class="home-works__badge">{{ t('home.workCount', { count: work.count }) }}</span>
        </span>
        <span class="home-works__name">{{ work.name }}</span>
      </RouterLink>
    </AppCarousel>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import AppCarousel from '@/shared/components/AppCarousel.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const { t } = useI18n();
const activityStore = useActivityStore();
const { works } = storeToRefs(activityStore);

onMounted(() => {
  if (!works.value.length) {
    activityStore.fetchWorks(10);
  }
});
</script>

<style scoped lang="scss">
@use '../styles/home-works';
</style>
