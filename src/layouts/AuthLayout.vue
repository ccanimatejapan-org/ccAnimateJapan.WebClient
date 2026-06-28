<template>
  <main class="auth-shell">
    <section class="auth-panel">
      <RouterLink class="site-header__brand" :to="{ name: ROUTE_NAMES.HOME }">
        <img class="site-header__logo" :src="brandLogo" alt="CC日本動漫代購" />
        <span class="site-header__brand-copy">
          <span class="site-header__brand-name">CC日本動漫代購</span>
        </span>
      </RouterLink>
      <RouterView />
    </section>
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import brandLogo from '@/assets/logo/brand-logo.jpg';
</script>

<style scoped lang="scss">
@use './styles/auth-layout';
</style>
