<template>
  <div class="auth-form">
    <p class="eyebrow">{{ t('auth.eyebrow') }}</p>
    <h1>{{ t('auth.title') }}</h1>
    <p>{{ t('auth.description') }}</p>
    <AppButton :disabled="isSigningIn" @click="mockLineLogin">
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
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();
const isSigningIn = ref(false);

async function mockLineLogin() {
  if (isSigningIn.value) return;

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
