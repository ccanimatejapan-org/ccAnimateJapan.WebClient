<template>
  <div class="work-list section">
    <header class="page-head">
      <p class="eyebrow">{{ t('work.eyebrow') }}</p>
      <h1>{{ t('work.listTitle') }}</h1>
      <p class="page-head__desc">{{ t('work.listSubtitle') }}</p>
    </header>

    <AppLoading v-if="allWorksLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="allWorksError" icon="info" :message="t('activity.loadFailed')" />
    <AppEmpty v-else-if="allWorksLoaded && !allWorks.length" :message="t('work.empty')" />
    <div v-else class="work-tiles work-list__grid">
      <RouterLink
        v-for="work in allWorks"
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
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';

const { t } = useI18n();
const activityStore = useActivityStore();
const { allWorks, allWorksLoaded, allWorksLoading, allWorksError } = storeToRefs(activityStore);

onMounted(async () => {
  if (!allWorksLoaded.value) await activityStore.fetchAllWorks();
});
</script>

<style scoped lang="scss">
@use '../styles/work-list';
</style>
