<template>
  <div class="work-list">
    <header class="work-list__head">
      <h1 class="work-list__title">{{ t('work.listTitle') }}</h1>
      <p class="work-list__subtitle">{{ t('work.listSubtitle') }}</p>
    </header>

    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="!works.length" :message="t('work.empty')" />
    <div v-else class="work-list__grid">
      <RouterLink
        v-for="work in works"
        :key="work.id"
        class="work-list__card"
        :to="{ name: ROUTE_NAMES.WORK_ACTIVITIES, params: { animateTypeId: work.id } }"
      >
        <span class="work-list__circle">{{ work.name }}</span>
        <span class="work-list__name">{{ work.name }}</span>
        <span class="work-list__count">{{ t('home.workCount', { count: work.count }) }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';

const { t } = useI18n();
const activityStore = useActivityStore();
const { works } = storeToRefs(activityStore);
const isLoading = ref(false);

onMounted(async () => {
  if (works.value.length) return;
  isLoading.value = true;
  try {
    await activityStore.fetchWorks();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
@use '../styles/work-list';
</style>
