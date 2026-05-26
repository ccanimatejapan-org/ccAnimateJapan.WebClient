<template>
  <section class="section narrow-section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('member.eyebrow') }}</p>
        <h1>{{ t('member.profile') }}</h1>
      </div>
      <RouterLink :to="{ name: ROUTE_NAMES.MEMBER_ADDRESS_BOOK }">
        {{ t('member.addressBook') }}
      </RouterLink>
    </div>
    <ProfileForm v-if="profile" :profile="profile" @submit="save" />
    <AppLoading v-else :label="t('common.loading')" />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppLoading from '@/shared/components/AppLoading.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import ProfileForm from '../components/ProfileForm.vue';
import { getProfile, updateProfile } from '../api/memberApi';

const { t } = useI18n();
const profile = ref(null);

onMounted(async () => {
  profile.value = await getProfile();
});

async function save(payload) {
  profile.value = await updateProfile(payload);
}
</script>
