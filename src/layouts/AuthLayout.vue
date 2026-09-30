<template>
  <div class="auth-shell">
    <header class="auth-header">
      <RouterLink class="auth-header__brand" :to="{ name: ROUTE_NAMES.HOME }">
        <img class="auth-header__logo" :src="brandLogo" alt="" />
        <span class="auth-header__copy">
          <strong>CC日本動漫代購</strong>
          <small>YOUR LITTLE COLLECTION</small>
        </span>
      </RouterLink>
      <LanguageSwitcher />
    </header>
    <main class="auth-panel">
      <img class="auth-panel__logo" :src="brandLogo" alt="CC日本動漫代購" />
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher.vue';
import brandLogo from '@/assets/logo/brand-logo.jpg';
</script>

<style scoped lang="scss">
@use './styles/auth-layout';
</style>
