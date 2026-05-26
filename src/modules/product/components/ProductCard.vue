<template>
  <article class="product-card">
    <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id: product.id } }">
      <img :src="product.imageUrl" :alt="product.name" loading="lazy" />
    </RouterLink>
    <div class="product-card__body">
      <p>{{ product.category }}</p>
      <h3>{{ product.name }}</h3>
      <AppPrice :value="product.price" />
      <AppButton @click="cart.addItem(product)">{{ t('product.addToCart') }}</AppButton>
    </div>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '@/modules/cart/stores/cartStore';

defineProps({
  product: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();
const cart = useCartStore();
</script>

<style scoped lang="scss">
@use '../styles/product-card';
</style>
