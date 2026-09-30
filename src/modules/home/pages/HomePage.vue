<template>
  <div class="home-page">
    <form class="search-field home-page__search" role="search" @submit.prevent="submitSearch">
      <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0" /></svg>
      <input
        v-model="keyword"
        type="search"
        enterkeyhint="search"
        :placeholder="t('home.searchPlaceholder')"
        :aria-label="t('home.searchPlaceholder')"
      />
    </form>

    <HomeBannerCarousel />

    <nav class="home-shortcuts" :aria-label="t('home.shortcuts.label')">
      <RouterLink
        v-for="item in shortcuts"
        :key="item.label"
        class="home-shortcuts__item"
        :class="`home-shortcuts__item--${item.tone}`"
        :to="item.to"
      >
        <span class="home-shortcuts__symbol" aria-hidden="true">
          <svg class="ui-icon" viewBox="0 0 24 24"><path :d="item.icon" /></svg>
        </span>
        {{ t(item.label) }}
      </RouterLink>
    </nav>

    <HomeOngoingActivities
      :activities="activityStore.latestActivities"
      :loading="activityStore.isLatestLoading"
    />
    <HomePopularActivities />
    <HomeAnimateTypeRow />
    <HomeEndingSoonActivities
      :activities="activityStore.endingSoonActivities"
      :loading="activityStore.isEndingSoonLoading"
    />

    <RouterLink class="notice home-page__guide" :to="{ name: ROUTE_NAMES.USER_GUIDE }">
      <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1ZM12 5v16" /></svg>
      <span>
        <strong>{{ t('home.guide.title') }}</strong><br />
        {{ t('home.guide.description') }}
      </span>
      <svg class="ui-icon home-page__guide-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
    </RouterLink>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/modules/activity/stores/activityStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import HomeBannerCarousel from '../components/HomeBannerCarousel.vue';
import HomeAnimateTypeRow from '../components/HomeAnimateTypeRow.vue';
import HomePopularActivities from '../components/HomePopularActivities.vue';
import HomeOngoingActivities from '../components/HomeOngoingActivities.vue';
import HomeEndingSoonActivities from '../components/HomeEndingSoonActivities.vue';

const { t } = useI18n();
const router = useRouter();
const activityStore = useActivityStore();
const keyword = ref('');

const shortcuts = [
  {
    label: 'home.shortcuts.works',
    tone: 'sand',
    icon: 'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
    to: { name: ROUTE_NAMES.WORK_LIST }
  },
  {
    label: 'home.shortcuts.inStock',
    tone: 'green',
    icon: 'm3 7 9-4 9 4v11l-9 4-9-4ZM3 7l9 4 9-4M12 11v11M7 5l9 4',
    to: { name: ROUTE_NAMES.ACTIVITY_LIST, query: { availability: 'inStock' } }
  },
  {
    label: 'home.shortcuts.latest',
    tone: 'rose',
    icon: 'M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    to: { name: ROUTE_NAMES.ACTIVITY_LIST }
  },
  {
    label: 'home.shortcuts.wish',
    tone: 'lilac',
    icon: 'm12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z',
    to: { name: ROUTE_NAMES.WISH_POOL }
  }
];

function submitSearch() {
  const q = keyword.value.trim();
  router.push({ name: ROUTE_NAMES.ACTIVITY_LIST, query: q ? { q } : {} });
}

onMounted(() => {
  // 「最新活動」資料由後端套用「過去兩週到今天」時間區間後回傳。
  activityStore.fetchLatestActivities();
  // 「快結束活動」資料由後端套用「今天到一週後」時間區間後回傳。
  activityStore.fetchEndingSoonActivities();
});
</script>

<style scoped lang="scss">
@use '../styles/home-page';
</style>
