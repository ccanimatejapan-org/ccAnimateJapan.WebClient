<template>
  <div class="page-stack">
    <HeroBanner />
    <ProductSection />
  </div>
</template>

<script setup>
import HeroBanner from '../components/HeroBanner.vue';
import ProductSection from '../components/ProductSection.vue';
</script>

<style scoped lang="scss">
@use '../styles/home-page';
</style>
