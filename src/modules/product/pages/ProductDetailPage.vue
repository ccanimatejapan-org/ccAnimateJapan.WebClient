<template>
  <section v-if="product" class="product-detail">
    <ProductImageGallery :product="product" />
    <div class="product-detail__content">
      <p class="eyebrow">{{ product.category }}</p>
      <h1>{{ product.name }}</h1>
      <AppPrice :value="product.price" />
      <p>{{ product.description }}</p>
      <AppButton @click="cart.addItem(product)">{{ t('product.addToCart') }}</AppButton>
    </div>
  </section>
  <AppEmpty v-else :message="t('product.notFound')" />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import ProductImageGallery from '../components/ProductImageGallery.vue';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import { useProductStore } from '../stores/productStore';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const cart = useCartStore();
const productStore = useProductStore();
const product = computed(() =>
  productStore.products.find((item) => item.id === Number(props.id))
);
</script>

<style scoped lang="scss">
@use '../styles/product-detail';
</style>
