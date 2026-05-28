<template>
  <div class="page-stack">
    <HeroBanner />
    <ActivitySection />
  </div>
</template>

<script setup>
import ActivitySection from '../components/ActivitySection.vue';
import HeroBanner from '../components/HeroBanner.vue';
</script>

<style scoped lang="scss">
@use '../styles/home-page';
</style>
