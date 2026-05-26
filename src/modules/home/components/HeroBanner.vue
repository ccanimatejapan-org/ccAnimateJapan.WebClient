<template>
  <section class="hero-banner">
    <div class="hero-banner__content">
      <p class="eyebrow">{{ t('home.eyebrow') }}</p>
      <h1>{{ t('home.title') }}</h1>
      <p>{{ t('home.subtitle') }}</p>
      <RouterLink class="app-button app-button--primary" :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">
        {{ t('home.cta') }}
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/hero-banner';
</style>
