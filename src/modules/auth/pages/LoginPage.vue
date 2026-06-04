<template>
  <div class="auth-form">
    <p class="eyebrow">{{ t('auth.eyebrow') }}</p>
    <h1>{{ t('auth.title') }}</h1>
    <p>{{ t('auth.description') }}</p>
    <AppButton :disabled="isSigningIn" @click="handleLogin">
      {{ isSigningIn ? t('auth.signingIn') : t('auth.lineLogin') }}
    </AppButton>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { shouldUseMockApi } from '@/shared/api/mockMode';
import { useLineLogin } from '@/shared/composables/useLineLogin';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();
const { redirectToLineLogin } = useLineLogin();
const isSigningIn = ref(false);

async function handleLogin() {
  if (isSigningIn.value) return;

  // Real mode: hand off to LINE's OAuth screen (leaves the SPA).
  if (!shouldUseMockApi()) {
    redirectToLineLogin();
    return;
  }

  // Mock mode: keep the demo working without real LINE credentials.
  isSigningIn.value = true;
  try {
    await auth.signInWithLine('mock-line-code');
    router.push({ name: ROUTE_NAMES.HOME });
  } finally {
    isSigningIn.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
