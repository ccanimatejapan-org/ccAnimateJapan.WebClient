<template>
  <section class="auth-form">
    <p class="eyebrow">{{ t('auth.eyebrow') }}</p>
    <h1>{{ t('auth.notFriendTitle') }}</h1>
    <p>{{ t('auth.notFriendMessage') }}</p>
    <a
      v-if="addFriendUrl"
      class="app-button app-button--primary"
      :href="addFriendUrl"
      target="_blank"
      rel="noopener"
    >
      {{ t('auth.addFriend') }}
    </a>
    <button type="button" class="app-button app-button--secondary" @click="recheck">
      {{ t('auth.recheckFriend') }}
    </button>
    <RouterLink class="app-button app-button--secondary" :to="{ name: ROUTE_NAMES.LOGIN }">
      {{ t('auth.backToLogin') }}
    </RouterLink>
  </section>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const { t } = useI18n();
const router = useRouter();
const addFriendUrl = import.meta.env.VITE_LINE_ADD_FRIEND_URL || '';

// Re-enter the shop so the router guard re-checks friendship via liff.getFriendship().
function recheck() {
  router.replace({ name: ROUTE_NAMES.HOME });
}
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
