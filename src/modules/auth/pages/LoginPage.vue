<template>
  <div class="auth-form">
    <p class="eyebrow">{{ t('auth.eyebrow') }}</p>
    <h1>{{ t('auth.title') }}</h1>

    <!-- The LIFF login flow is driven by the router guard; this page is only
         reached on failure or when LIFF is not configured. Offer a retry. -->
    <p>{{ hasLiffError ? t('auth.liffError') : t('auth.description') }}</p>
    <AppButton @click="retry">{{ t('auth.login') }}</AppButton>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const hasLiffError = computed(() => route.query.error === 'liff');

// Re-enter the shop so the router guard re-runs the LIFF flow.
function retry() {
  router.replace({ name: ROUTE_NAMES.HOME });
}
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
