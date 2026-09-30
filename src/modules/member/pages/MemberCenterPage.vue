<template>
  <section class="section narrow-section">
    <header class="page-head">
      <RouterLink class="text-link member-center__back" :to="{ name: ROUTE_NAMES.MEMBER_CENTER }">
        <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        {{ t('nav.member') }}
      </RouterLink>
      <p class="eyebrow">{{ t('member.eyebrow') }}</p>
      <h1>{{ t(activeName === ROUTE_NAMES.MEMBER_ADDRESS_BOOK ? 'member.addressBook' : 'member.profile') }}</h1>
      <p class="page-head__desc">
        {{ t(activeName === ROUTE_NAMES.MEMBER_ADDRESS_BOOK ? 'member.addressBookDesc' : 'member.profileDesc') }}
      </p>
    </header>

    <div class="member-tabs ui-chips" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="ui-chip"
        role="tab"
        :aria-selected="activeName === tab.name"
        @click="selectTab(tab.name)"
      >
        {{ t(tab.label) }}
      </button>
    </div>

    <ProfilePanel v-if="activeName === ROUTE_NAMES.MEMBER_PROFILE" />
    <AddressPanel v-else />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import AddressPanel from '../components/AddressPanel.vue';
import ProfilePanel from '../components/ProfilePanel.vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const tabs = [
  { name: ROUTE_NAMES.MEMBER_PROFILE, label: 'member.profile' },
  { name: ROUTE_NAMES.MEMBER_ADDRESS_BOOK, label: 'member.addressBook' }
];
const activeName = computed(() => route.name);

function selectTab(name) {
  if (route.name !== name) router.push({ name });
}
</script>

<style scoped lang="scss">
@use '../styles/member-center';
</style>
