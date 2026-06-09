<template>
  <div class="auth-form">
    <p class="eyebrow">{{ t('auth.eyebrow') }}</p>
    <h1>{{ t('auth.title') }}</h1>

    <!-- Real mode: the LIFF login flow is driven by the router guard; this page is
         only reached on failure or when LIFF is not configured. Offer a retry. -->
    <template v-if="!isMock">
      <p>{{ hasLiffError ? t('auth.liffError') : t('auth.description') }}</p>
      <AppButton @click="retry">{{ t('auth.login') }}</AppButton>
    </template>

    <!-- Mock mode: keep the demo sign-in working without real LINE credentials. -->
    <template v-else>
      <p>{{ t('auth.description') }}</p>
      <AppButton :disabled="isSigningIn" @click="handleMockLogin">
        {{ isSigningIn ? t('auth.signingIn') : t('auth.lineLogin') }}
      </AppButton>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { shouldUseMockApi } from '@/shared/api/mockMode';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();

const isMock = shouldUseMockApi();
const hasLiffError = computed(() => route.query.error === 'liff');
const isSigningIn = ref(false);

// Real mode: re-enter the shop so the router guard re-runs the LIFF flow.
function retry() {
  router.replace({ name: ROUTE_NAMES.HOME });
}

// Mock mode only: simulate a LINE sign-in without real credentials.
async function handleMockLogin() {
  if (isSigningIn.value) return;
  isSigningIn.value = true;
  try {
    await auth.signInWithLiff('mock-line-token');
    router.push({ name: ROUTE_NAMES.HOME });
  } finally {
    isSigningIn.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
