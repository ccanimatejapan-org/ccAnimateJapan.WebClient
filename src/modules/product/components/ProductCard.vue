<template>
  <article class="product-card">
    <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id: product.id } }">
      <img :src="product.imageUrl" :alt="product.name" loading="lazy" />
    </RouterLink>
    <div class="product-card__body">
      <p>{{ product.category }}</p>
      <h3>{{ product.name }}</h3>
      <AppPrice :value="product.price" />
      <AppButton :class="{ 'is-added': justAdded }" @click="handleAddToCart">
        {{ justAdded ? t('product.addedToCart') : t('product.addToCart') }}
      </AppButton>
    </div>
  </article>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import { useUiStore } from '@/shared/stores/uiStore';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();
const cart = useCartStore();
const ui = useUiStore();
const justAdded = ref(false);
let addedTimer;

function handleAddToCart() {
  cart.addItem(props.product);
  justAdded.value = true;
  window.clearTimeout(addedTimer);
  addedTimer = window.setTimeout(() => {
    justAdded.value = false;
  }, 1400);
  ui.showToast({
    title: t('cart.toast.addedTitle'),
    message: t('cart.toast.addedMessage', { name: props.product.name }),
    actionLabel: t('cart.viewCart'),
    actionTo: { name: ROUTE_NAMES.CART }
  });
}

onBeforeUnmount(() => window.clearTimeout(addedTimer));
</script>

<style scoped lang="scss">
@use '../styles/product-card';
</style>
