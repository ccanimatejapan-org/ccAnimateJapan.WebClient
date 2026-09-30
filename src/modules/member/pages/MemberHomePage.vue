<template>
  <section class="member-home">
    <div class="member-home__hero">
      <div class="member-home__avatar" aria-hidden="true">{{ initial }}</div>
      <p class="eyebrow">{{ t('member.home.eyebrow') }}</p>
      <h1>{{ profile?.name || t('member.home.fallbackName') }}</h1>
      <p v-if="profile?.email" class="member-home__email">{{ profile.email }}</p>
    </div>

    <section class="panel">
      <div class="member-home__panel-head">
        <h2 class="panel__title">{{ t('nav.orders') }}</h2>
        <RouterLink class="text-link" :to="{ name: ROUTE_NAMES.ORDER_LIST }">
          {{ t('member.home.viewAllOrders') }}
          <svg class="ui-icon member-home__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
        </RouterLink>
      </div>
      <div class="member-home__order-list">
        <RouterLink
          v-for="stage in ORDER_STAGES"
          :key="stage.value"
          class="member-home__row"
          :to="{ name: ROUTE_NAMES.ORDER_LIST, query: { stage: stage.value } }"
        >
          <span class="member-home__row-label">{{ t(stage.labelKey) }}</span>
          <span class="member-home__row-value">
            <span v-if="orderCounts" class="member-home__order-count" :class="{ 'is-empty': !orderCounts[stage.value] }">
              {{ orderCounts[stage.value] ? t('member.home.orderCount', { count: orderCounts[stage.value] }) : t('member.home.noOrders') }}
            </span>
            <svg class="ui-icon member-home__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          </span>
        </RouterLink>
      </div>
    </section>

    <nav class="panel member-home__menu" :aria-label="t('member.title')">
      <RouterLink
        v-for="item in menuItems"
        :key="item.label"
        class="member-home__row"
        :to="{ name: item.name }"
      >
        <span class="member-home__row-label">
          <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="item.icon" /></svg>
          {{ t(item.label) }}
        </span>
        <svg class="ui-icon member-home__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
      </RouterLink>
    </nav>

    <section class="panel member-home__menu">
      <h2 class="panel__title">{{ t('member.home.support') }}</h2>
      <a
        v-for="link in supportLinks"
        :key="link.label"
        class="member-home__row"
        :href="link.href"
        target="_blank"
        rel="noopener"
      >
        <span class="member-home__row-label">
          <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICONS.message" /></svg>
          {{ t(link.label) }}
        </span>
        <svg class="ui-icon member-home__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
      </a>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { externalLinks } from '@/shared/constants/externalLinks';
import { countOrdersByStage, ORDER_STAGES } from '@/modules/order/utils/orderStages';
import { getOrders } from '@/modules/order/api/orderApi';
import { getProfile } from '../api/memberApi';

const ICONS = {
  user: 'M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  book: 'M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1ZM12 5v16',
  info: 'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  message: 'M21 11a9 9 0 0 1-9 9H4l-3 2 2-6a9 9 0 1 1 18-5Z'
};

const { t } = useI18n();
const profile = ref(null);
const orderCounts = ref(null);

const menuItems = [
  { name: ROUTE_NAMES.MEMBER_PROFILE, label: 'member.profile', icon: ICONS.user },
  { name: ROUTE_NAMES.MEMBER_ADDRESS_BOOK, label: 'member.addressBook', icon: ICONS.pin },
  { name: ROUTE_NAMES.USER_GUIDE, label: 'footer.userGuide', icon: ICONS.book },
  { name: ROUTE_NAMES.PURCHASE_NOTICE, label: 'footer.purchaseNotice', icon: ICONS.info }
];

const supportLinks = [
  { href: externalLinks.lineOfficial, label: 'footer.lineOfficial' },
  { href: externalLinks.lineCommunity, label: 'footer.lineCommunity' },
  { href: externalLinks.instagram, label: 'footer.instagram' },
  { href: externalLinks.threads, label: 'footer.threads' }
];

const initial = computed(() => (profile.value?.name || 'CC').trim().slice(0, 1));

async function loadProfile() {
  try {
    profile.value = await getProfile();
  } catch {
    profile.value = null;
  }
}

async function loadOrderCounts() {
  try {
    const result = await getOrders();
    orderCounts.value = countOrdersByStage(Array.isArray(result) ? result : result?.items);
  } catch {
    orderCounts.value = null;
  }
}

onMounted(() => {
  loadProfile();
  loadOrderCounts();
});
</script>

<style scoped lang="scss">
@use '../styles/member-home';
</style>
