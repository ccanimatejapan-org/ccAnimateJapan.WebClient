<template>
  <section class="auth-form">
    <AppLoading :label="t('auth.processingLine')" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppLoading from '@/shared/components/AppLoading.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { shouldUseMockApi } from '@/shared/api/mockMode';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();

// The LIFF flow no longer uses an OAuth code/state callback. This page only
// remains as a defensive redirect (e.g. stale callback URLs from the old flow).
onMounted(async () => {
  if (shouldUseMockApi()) {
    await auth.signInWithLiff('mock-line-token');
    router.replace({ name: ROUTE_NAMES.HOME });
    return;
  }

  router.replace({ name: ROUTE_NAMES.LOGIN });
});
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
