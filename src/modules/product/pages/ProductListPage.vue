<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('product.activityEyebrow') }}</p>
        <h1>{{ productStore.activity?.name || t('product.activityTitleFallback') }}</h1>
      </div>
    </div>

    <AppLoading v-if="productStore.isLoading || isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="productStore.error || loadFailed" :message="t('product.loadFailed')" />
    <AppEmpty v-else-if="!productStore.activity" :message="t('activity.notFound')" />
    <AppEmpty
      v-else-if="products.length === 0"
      :message="t('product.emptyForActivity')"
           />
    <div v-else>
      <OfficialShippingCard
        class="product-list__shipping"
        :is-pre-order="productStore.activity?.isPreOrder"
        :start-time="productStore.activity?.officialShippingStartTime"
        :end-time="productStore.activity?.officialShippingEndTime"
        variant="full"
           />

      <div class="product-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :activity="productStore.activity"
          @add="openAddDialog"
          />
      </div>
    </div>
    <ProductAddDialog
      v-model="isAddDialogOpen"
      :activity="productStore.activity"
      :product="selectedProduct"
      :cart-quantity="cartQuantityForProduct"
      :is-adding="isAdding"
      @confirm="addToCart"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import OfficialShippingCard from '@/shared/components/OfficialShippingCard.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import { useUiStore } from '@/shared/stores/uiStore';
import { useSingleFlight } from '@/shared/composables/useSingleFlight';
import ProductAddDialog from '../components/ProductAddDialog.vue';
import ProductCard from '../components/ProductCard.vue';
import { useActivityProducts } from '../composables/useActivityProducts';
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

const { products, isLoading, loadFailed, load } = useActivityProducts(productStore.fetchProductsByActivity);
const cartQuantityForProduct = computed(() => {
  const productId = selectedProduct.value?.id;
  if (!productId) return 0;
  return cart.items.reduce(
    (total, item) => total + (item.productId === productId ? item.quantity : 0),
    0
  );
});
const { isPending: isAdding, run: runAdd } = useSingleFlight();

function loadProducts() {
  load(props.activityId);
}

onMounted(() => {
  productStore.getOrFetchActivity(props.activityId);
  loadProducts();
});

watch(
  () => props.activityId,
  (activityId) => {
    selectedProduct.value = null;
    productStore.reset();
    productStore.getOrFetchActivity(activityId);
    load(activityId);
  }
);

function openAddDialog(product) {
  if (!product?.id) return;
  selectedProduct.value = product;
}

async function addToCart(payload) {
  return runAdd(async () => {
    const product = selectedProduct.value;
    const activity = productStore.activity;
    if (!product?.id || !activity?.id) return;

    const result = await cart.addItem({
      activity,
      product,
      quantity: payload.quantity,
      note: payload.note
    });

    if (!result.ok) {
      if (result.reason === 'quantityLimit') {
        ui.showToast({
          title: t('cart.toast.quantityLimitTitle'),
          message: t('cart.toast.quantityLimitMessage')
        });
        return;
      }
      ui.showToast({
        title: t('cart.toast.addFailedTitle'),
        message: t('cart.toast.addFailedMessage')
      });
      return;
    }

    const isLastInStock = activity.isPreOrder === false && Number(product.stock) === 1;
    ui.showToast({
      title: t('cart.toast.addedTitle'),
      message: t(isLastInStock ? 'cart.toast.addedLastStockMessage' : 'cart.toast.addedMessage', { name: product.name }),
      actionLabel: t('cart.viewCart'),
      actionTo: { name: ROUTE_NAMES.CART }
    });

    selectedProduct.value = null;
  });
}

</script>

<style scoped lang="scss">
@use '../styles/product-grid';

.product-list__shipping {
  margin-bottom: 12px;
}
</style>
