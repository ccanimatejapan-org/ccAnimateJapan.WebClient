<template>
  <section class="auth-form">
    <AppLoading v-if="isProcessing" :label="t('auth.processingLine')" />
    <template v-else-if="errorMessage">
      <p class="eyebrow">{{ t('auth.eyebrow') }}</p>
      <h1>{{ t('auth.loginFailedTitle') }}</h1>
      <p>{{ errorMessage }}</p>
      <RouterLink class="app-button app-button--primary" :to="{ name: ROUTE_NAMES.LOGIN }">
        {{ t('auth.backToLogin') }}
      </RouterLink>
    </template>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppLoading from '@/shared/components/AppLoading.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { shouldUseMockApi } from '@/shared/api/mockMode';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();

const isProcessing = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  try {
    if (shouldUseMockApi()) {
      await auth.signInWithLine(route.query.code || 'mock-line-callback');
      router.replace({ name: ROUTE_NAMES.HOME });
      return;
    }

    // Real OAuth callback: validate the anti-CSRF state first.
    const expectedState = sessionStorage.getItem('line_login_state');
    sessionStorage.removeItem('line_login_state');
    const code = route.query.code;
    const state = route.query.state;

    if (!code || !state || state !== expectedState) {
      errorMessage.value = t('auth.loginFailed');
      isProcessing.value = false;
      return;
    }

    await auth.signInWithLine(code);
    router.replace({ name: ROUTE_NAMES.HOME });
  } catch (error) {
    if (error?.message === 'notFriend') {
      router.replace({ name: ROUTE_NAMES.LINE_ADD_FRIEND });
      return;
    }
    errorMessage.value = t('auth.loginFailed');
    isProcessing.value = false;
  }
});
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
