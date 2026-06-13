<template>
  <div class="auth-form">
    <p class="eyebrow">{{ t('auth.eyebrow') }}</p>
    <h1>{{ t('auth.title') }}</h1>

    <!-- The LIFF login flow is driven by the router guard; this page is only
         reached on failure or when LIFF is not configured. Offer a retry. -->
    <p>{{ isAutoRetrying ? t(autoRetryMessageKey) : hasLiffError ? t('auth.liffError') : t('auth.description') }}</p>
    <AppButton v-if="!isAutoRetrying" @click="retry">{{ t('auth.login') }}</AppButton>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const AUTO_RETRY_STORAGE_KEY = 'ccAnimateJapan.auth.autoRetry';

const route = useRoute();
const router = useRouter();
const { t, te } = useI18n();

const hasLiffError = computed(() => route.query.error === 'liff');

// Re-enter the shop so the router guard re-runs the LIFF flow.
function retry() {
  router.replace({ name: ROUTE_NAMES.HOME });
}
const hasHardError = computed(() => Boolean(route.query.error));
const hasAutoRetried = ref(route.query.retried === '1' || sessionStorage.getItem(AUTO_RETRY_STORAGE_KEY) === '1');
const shouldAutoRetry = computed(() => !hasAutoRetried.value && !hasHardError.value);
const isAutoRetrying = ref(shouldAutoRetry.value);
const autoRetryMessageKey = computed(() => {
  if (te('auth.processingLine')) return 'auth.processingLine';
  if (te('auth.signingIn')) return 'auth.signingIn';
  return 'auth.description';
});

onMounted(async () => {
  if (!shouldAutoRetry.value) {
    sessionStorage.removeItem(AUTO_RETRY_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(AUTO_RETRY_STORAGE_KEY, '1');
  try {
    await router.replace({ name: ROUTE_NAMES.HOME });
  } catch {
  } finally {
    sessionStorage.removeItem(AUTO_RETRY_STORAGE_KEY);
    hasAutoRetried.value = true;
    if (router.currentRoute.value.name === ROUTE_NAMES.LOGIN) {
      isAutoRetrying.value = false;
    }
  }
});
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
