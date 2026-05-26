<template>
  <main class="auth-shell">
    <section class="auth-panel">
      <RouterLink class="site-header__brand" :to="{ name: ROUTE_NAMES.HOME }">
        ccAnimateJapan
      </RouterLink>
      <RouterView />
    </section>
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ROUTE_NAMES } from '@/shared/constants/routes';
</script>

<style scoped lang="scss">
@use './styles/auth-layout';
</style>
