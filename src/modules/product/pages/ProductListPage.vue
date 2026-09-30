<template>
  <section class="section product-list">
    <header class="page-head">
      <RouterLink class="text-link product-list__back" :to="{ name: ROUTE_NAMES.ACTIVITY_LIST }">
        <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        {{ t('product.backToActivities') }}
      </RouterLink>
      <p class="eyebrow">{{ productStore.activity?.animateTypeName || t('product.activityEyebrow') }}</p>
      <h1>{{ productStore.activity?.name || t('product.activityTitleFallback') }}</h1>
    </header>

    <div v-if="productStore.activity?.imageUrl" class="product-list__cover">
      <img :src="productStore.activity.imageUrl" :alt="productStore.activity.name || ''" />
    </div>

    <AppLoading v-if="productStore.isLoading || isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="productStore.error || loadFailed" icon="info" :message="t('product.loadFailed')">
      <button type="button" class="app-button app-button--dark" @click="loadProducts">{{ t('common.retry') }}</button>
    </AppEmpty>
    <AppEmpty v-else-if="!productStore.activity" icon="search" :message="t('activity.notFound')" />
    <AppEmpty
      v-else-if="products.length === 0"
      :message="t('product.emptyForActivity')"
    />
    <div v-else class="product-list__body">
      <div class="product-list__info">
        <div class="product-list__facts">
          <p v-if="deadlineLabel" class="product-list__fact">
            <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0" /></svg>
            {{ t('product.deadline', { date: deadlineLabel }) }}
          </p>
          <p v-if="showGroupBuyProgress" class="product-list__fact product-list__progress">
            <span>{{ progressLabel }}</span>
            <span class="product-list__progress-track" aria-hidden="true">
              <span :style="{ width: progressPercent + '%' }"></span>
            </span>
          </p>
          <p v-else-if="isGroupFormed" class="product-list__fact product-list__fact--formed">
            {{ t('home.groupBuyFormed') }}
          </p>
        </div>
        <OfficialShippingCard
          :is-pre-order="productStore.activity?.isPreOrder"
          :start-time="productStore.activity?.officialShippingStartTime"
          :end-time="productStore.activity?.officialShippingEndTime"
          variant="full"
        />
      </div>

      <label class="search-field">
        <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0" /></svg>
        <input
          v-model="productSearch"
          type="search"
          :placeholder="t('product.searchPlaceholder')"
          :aria-label="t('product.searchPlaceholder')"
        />
      </label>

      <p class="product-list__count">{{ t('product.count', { count: filteredProducts.length }) }}</p>

      <AppEmpty v-if="!filteredProducts.length" icon="search" :message="t('product.searchEmpty')">
        <button type="button" class="app-button app-button--dark" @click="productSearch = ''">
          {{ t('common.clearSearch') }}
        </button>
      </AppEmpty>
      <div v-else class="card-grid">
        <ProductCard
          v-for="product in filteredProducts"
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
import { RouterLink } from 'vue-router';
import { GROUP_BUY_STATUS } from '@/shared/constants/groupBuy';
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

const { locale, t } = useI18n();
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
const productSearch = ref('');

// 本活動內商品名稱搜尋（前端篩選已載入的商品）。
const filteredProducts = computed(() => {
  const keyword = productSearch.value.trim().toLocaleLowerCase();
  if (!keyword) return products.value;
  return products.value.filter((product) =>
    String(product?.name ?? '').toLocaleLowerCase().includes(keyword)
  );
});

const deadlineLabel = computed(() => {
  const value = productStore.activity?.activeEndTime;
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
});

// 募集資訊只呈現百分比。
const showGroupBuyProgress = computed(() => {
  const activity = productStore.activity;
  return Boolean(
    activity?.isPreOrder &&
    activity.groupBuyStatus === GROUP_BUY_STATUS.RECRUITING &&
    activity.groupBuyProgressPercent != null
  );
});

const isGroupFormed = computed(() => productStore.activity?.groupBuyStatus === GROUP_BUY_STATUS.FORMED);

const progressPercent = computed(() =>
  Math.max(0, Math.min(100, Number(productStore.activity?.groupBuyProgressPercent) || 0))
);

const progressLabel = computed(() =>
  progressPercent.value >= 100
    ? t('home.groupBuyReached')
    : t('home.groupBuyProgressPercent', { percent: progressPercent.value })
);
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
    productSearch.value = '';
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
</style>
