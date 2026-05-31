<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('product.activityEyebrow') }}</p>
        <h1>{{ productStore.activity?.name || t('product.activityTitleFallback') }}</h1>
        <p v-if="productStore.activity?.info" class="product-page__intro">
          {{ productStore.activity.info }}
        </p>
      </div>
    </div>

    <AppLoading v-if="productStore.isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="productStore.error" :message="t('product.loadFailed')" />
    <AppEmpty v-else-if="!productStore.activity" :message="t('activity.notFound')" />
    <AppEmpty
      v-else-if="productStore.products.length === 0"
      :message="t('product.emptyForActivity')"
    />

    <div v-else class="product-grid">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.id"
        :product="product"
        @add="openAddDialog"
      />
    </div>

    <ProductAddDialog
      v-model="isAddDialogOpen"
      :activity="productStore.activity"
      :product="selectedProduct"
      @confirm="addToCart"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import { useUiStore } from '@/shared/stores/uiStore';
import ProductAddDialog from '../components/ProductAddDialog.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductStore } from '../stores/productStore';

const props = defineProps({
  activityId: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const productStore = useProductStore();
const cart = useCartStore();
const ui = useUiStore();
const selectedProduct = ref(null);
const isAddDialogOpen = computed({
  get: () => Boolean(selectedProduct.value),
  set: (value) => {
    if (!value) selectedProduct.value = null;
  }
});

onMounted(() => {
  productStore.fetchProductsByActivity(props.activityId);
});

watch(
  () => props.activityId,
  (activityId) => {
    selectedProduct.value = null;
    productStore.fetchProductsByActivity(activityId);
  }
);

function openAddDialog(product) {
  selectedProduct.value = product;
}

function addToCart(payload) {
  if (!selectedProduct.value || !productStore.activity) return;

  const result = cart.addItem({
    activity: productStore.activity,
    product: selectedProduct.value,
    quantity: payload.quantity,
    note: payload.note
  });

  if (!result.ok) {
    ui.showToast({
      title: t('cart.toast.mixedActivityTitle'),
      message: t('cart.toast.mixedActivityMessage')
    });
    return;
  }

  ui.showToast({
    title: t('cart.toast.addedTitle'),
    message: t('cart.toast.addedMessage', { name: selectedProduct.value.name }),
    actionLabel: t('cart.viewCart'),
    actionTo: { name: ROUTE_NAMES.CART }
  });

  selectedProduct.value = null;
}

</script>

<style scoped lang="scss">
@use '../styles/product-grid';
</style>
