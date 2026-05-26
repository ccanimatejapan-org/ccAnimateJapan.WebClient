<template>
  <div class="auth-form">
    <p class="eyebrow">{{ t('auth.eyebrow') }}</p>
    <h1>{{ t('auth.title') }}</h1>
    <form class="form-grid" @submit.prevent="submit">
      <label class="form-grid__full">
        <span>{{ t('auth.email') }}</span>
        <input v-model="form.email" type="email" required />
      </label>
      <label class="form-grid__full">
        <span>{{ t('auth.password') }}</span>
        <input v-model="form.password" type="password" required />
      </label>
      <AppButton class="form-grid__full" type="submit">{{ t('auth.login') }}</AppButton>
    </form>
    <button type="button" class="line-login-button" @click="redirectToLineLogin">
      {{ t('auth.lineLogin') }}
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useLineLogin } from '@/shared/composables/useLineLogin';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();
const { redirectToLineLogin } = useLineLogin();
const form = reactive({
  email: '',
  password: ''
});

async function submit() {
  await auth.signIn(form);
  router.push({ name: ROUTE_NAMES.MEMBER_PROFILE });
}
</script>

<style scoped lang="scss">
@use '../styles/auth-form';
</style>
