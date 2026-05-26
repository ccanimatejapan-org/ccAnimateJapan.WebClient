<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('home.featuredEyebrow') }}</p>
        <h2>{{ t('home.featuredTitle') }}</h2>
      </div>
      <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">{{ t('common.viewAll') }}</RouterLink>
    </div>

    <div class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ProductCard from '@/modules/product/components/ProductCard.vue';
import { useProductStore } from '@/modules/product/stores/productStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const { t } = useI18n();
const productStore = useProductStore();
const products = computed(() => productStore.featuredProducts);
</script>

<style scoped lang="scss">
@use '@/modules/product/styles/product-grid';
</style>
