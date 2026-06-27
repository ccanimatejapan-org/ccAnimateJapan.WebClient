<template>
  <section class="section narrow-section">
    <h1>{{ t('member.title') }}</h1>

    <div class="member-tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="member-tabs__item"
        :class="{ 'member-tabs__item--active': activeName === tab.name }"
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
import { useRoute, useRouter } from 'vue-router';
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
