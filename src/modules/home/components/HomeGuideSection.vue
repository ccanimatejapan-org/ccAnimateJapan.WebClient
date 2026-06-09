<template>
  <section class="home-guide">
    <h2 class="home-guide__title">{{ t('home.guide.title') }}</h2>
    <p class="home-guide__desc">{{ t('home.guide.desc') }}</p>
    <a class="home-guide__cta" :href="externalLinks.lineOfficial" target="_blank" rel="noopener">
      {{ t('home.guide.lineCta') }}
    </a>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { externalLinks } from '@/shared/constants/externalLinks';

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/home-guide';
</style>
