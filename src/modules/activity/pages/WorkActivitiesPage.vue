<template>
  <div class="work-activities">
    <header class="work-activities__head">
      <RouterLink class="work-activities__back" :to="{ name: ROUTE_NAMES.WORK_LIST }">
        ‹ {{ t('work.listTitle') }}
      </RouterLink>
      <h1 class="work-activities__title">{{ workName }}</h1>
    </header>

    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="!activities.length" :message="t('work.activitiesEmpty')" />
    <div v-else class="work-activities__grid">
      <HomeActivityCard
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        variant="compact"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import HomeActivityCard from '@/modules/home/components/HomeActivityCard.vue';

const props = defineProps({
  animateTypeId: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const activityStore = useActivityStore();

const activities = ref([]);
const isLoading = ref(false);

// 作品名取自第一筆活動（後端活動已帶 animateTypeName）。
const workName = computed(() => activities.value[0]?.animateTypeName || t('work.notFound'));

async function load(animateTypeId) {
  isLoading.value = true;
  try {
    activities.value = await activityStore.fetchActivitiesByWork(animateTypeId);
  } catch {
    activities.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => load(props.animateTypeId));
watch(() => props.animateTypeId, (id) => load(id));
</script>

<style scoped lang="scss">
@use '../styles/work-activities';
</style>
