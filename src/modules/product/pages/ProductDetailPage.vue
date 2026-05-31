<template>
  <section v-if="product" class="product-detail">
    <ProductImageGallery :product="product" />
    <div class="product-detail__content">
      <p class="eyebrow">{{ product.category }}</p>
      <h1>{{ product.name }}</h1>
      <AppPrice :value="product.price" />
      <p>{{ product.description }}</p>
      <AppButton :class="{ 'is-added': justAdded }" @click="handleAddToCart">
        {{ justAdded ? t('product.addedToCart') : t('product.addToCart') }}
      </AppButton>
    </div>
  </section>
  <AppEmpty v-else :message="t('product.notFound')" />
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import ProductImageGallery from '../components/ProductImageGallery.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import { useUiStore } from '@/shared/stores/uiStore';
import { useProductStore } from '../stores/productStore';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const cart = useCartStore();
const ui = useUiStore();
const productStore = useProductStore();
const justAdded = ref(false);
let addedTimer;

const product = computed(() =>
  productStore.products.find((item) => item?.id === Number(props.id))
);

function handleAddToCart() {
  if (!product.value) return;
  cart.addItem(product.value);
  justAdded.value = true;
  window.clearTimeout(addedTimer);
  addedTimer = window.setTimeout(() => {
    justAdded.value = false;
  }, 1400);
  ui.showToast({
    title: t('cart.toast.addedTitle'),
    message: t('cart.toast.addedMessage', { name: product.value.name }),
    actionLabel: t('cart.viewCart'),
    actionTo: { name: ROUTE_NAMES.CART }
  });
}

onBeforeUnmount(() => window.clearTimeout(addedTimer));
</script>

<style scoped lang="scss">
@use '../styles/product-detail';
</style>
