<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('product.eyebrow') }}</p>
        <h1>{{ t('product.title') }}</h1>
      </div>
      <ProductFilter :model-value="productStore.selectedCategory" @update:model-value="productStore.setCategory" />
    </div>

    <div class="product-grid">
      <ProductCard v-for="product in productStore.filteredProducts" :key="product.id" :product="product" />
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import ProductCard from '../components/ProductCard.vue';
import ProductFilter from '../components/ProductFilter.vue';
import { useProductStore } from '../stores/productStore';

const { t } = useI18n();
const productStore = useProductStore();
</script>

<style scoped lang="scss">
@use '../styles/product-grid';
</style>
