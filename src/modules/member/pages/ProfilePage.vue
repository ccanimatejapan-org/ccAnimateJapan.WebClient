<template>
  <section class="section narrow-section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('member.eyebrow') }}</p>
        <h1>{{ t('member.profile') }}</h1>
      </div>
      <RouterLink
        class="app-button app-button--secondary"
        :to="{ name: ROUTE_NAMES.MEMBER_ADDRESS_BOOK }"
      >
        {{ t('member.addressBook') }}
      </RouterLink>
    </div>
    <ProfileForm v-if="profile" :profile="profile" :saving="saving" @submit="save" />
    <AppLoading v-else :label="t('common.loading')" />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppLoading from '@/shared/components/AppLoading.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useUiStore } from '@/shared/stores/uiStore';
import ProfileForm from '../components/ProfileForm.vue';
import { getProfile, updateProfile } from '../api/memberApi';

const { t } = useI18n();
const ui = useUiStore();
const profile = ref(null);
const saving = ref(false);

onMounted(async () => {
  try {
    profile.value = await getProfile();
  } catch (error) {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.loadFailed') });
  }
});

async function save(payload) {
  saving.value = true;
  try {
    profile.value = await updateProfile(payload);
    ui.showToast({ title: t('member.profile'), message: t('member.saveSuccess') });
  } catch {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.saveFailed') });
  } finally {
    saving.value = false;
  }
}
</script>
