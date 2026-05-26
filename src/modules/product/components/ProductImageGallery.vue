<template>
  <div class="product-gallery">
    <img :src="product.imageUrl" :alt="product.name" />
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<style scoped lang="scss">
@use '../styles/product-gallery';
</style>
