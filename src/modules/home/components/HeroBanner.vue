<template>
  <section class="hero-banner">
    <div class="hero-banner__content">
      <p class="eyebrow">{{ t('home.eyebrow') }}</p>
      <h1>{{ t('home.title') }}</h1>
      <p>{{ t('home.subtitle') }}</p>
      <div class="hero-banner__actions">
        <a class="app-button app-button--primary" href="#activities">
          {{ t('home.cta') }}
        </a>
        <span>{{ t('home.note') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/hero-banner';
</style>
