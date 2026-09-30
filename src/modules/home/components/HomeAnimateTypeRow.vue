<template>
  <section v-if="homeWorks.length" class="home-works">
    <div class="section-head">
      <h2>{{ t('home.animateType.title') }}</h2>
      <RouterLink class="section-head__more" :to="{ name: ROUTE_NAMES.WORK_LIST }">
        {{ t('home.animateType.viewAll') }}
        <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" width="15" height="15"><path d="m9 5 7 7-7 7" /></svg>
      </RouterLink>
    </div>

    <div class="work-tiles">
      <RouterLink
        v-for="work in visibleWorks"
        :key="work.id"
        class="work-tile"
        :to="{ name: ROUTE_NAMES.WORK_ACTIVITIES, params: { animateTypeId: work.id } }"
      >
        <img v-if="work.imageUrl" class="work-tile__img" :src="work.imageUrl" alt="" loading="lazy" />
        <span v-else class="work-tile__img work-tile__fallback" aria-hidden="true">{{ (work.name || '?').slice(0, 1) }}</span>
        <span class="work-tile__copy">
          <strong>{{ work.name }}</strong>
          <small>{{ t('home.workCount', { count: work.count }) }}</small>
        </span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const { t } = useI18n();
const activityStore = useActivityStore();
const { homeWorks } = storeToRefs(activityStore);
const visibleWorks = computed(() => homeWorks.value.slice(0, 8));

onMounted(() => {
  if (!homeWorks.value.length) {
    activityStore.fetchHomeWorks(10);
  }
});
</script>

<style scoped lang="scss">
@use '../styles/home-works';
</style>
