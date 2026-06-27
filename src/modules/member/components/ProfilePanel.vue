<template>
  <ProfileForm v-if="profile" :profile="profile" :saving="saving" @submit="save" />
  <AppLoading v-else :label="t('common.loading')" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppLoading from '@/shared/components/AppLoading.vue';
import { useUiStore } from '@/shared/stores/uiStore';
import { getProfile, updateProfile } from '../api/memberApi';
import ProfileForm from './ProfileForm.vue';

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
