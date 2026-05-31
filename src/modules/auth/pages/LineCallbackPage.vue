<template>
  <section class="auth-form">
    <AppLoading :label="t('auth.processingLine')" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppLoading from '@/shared/components/AppLoading.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();

onMounted(async () => {
  await auth.signInWithLine(route.query.code || 'mock-line-callback');
  router.replace({ name: ROUTE_NAMES.HOME });
});
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
