<template>
  <article v-if="product" class="product-card">
    <ProductImageCarousel :images="product.imageUrls" :alt="product.name" />
    <div class="product-card__body">
      <p v-if="product.productTypeName">{{ product.productTypeName }}</p>
      <h3>{{ product.name }}</h3>
      <span v-if="noteText" class="product-card__note">{{ noteText }}</span>
      <AppPrice :value="product.price" />
    </div>
    <button
      type="button"
      class="product-card__buy"
      :disabled="isAddDisabled"
      @click="$emit('add', product)"
    >
      <svg v-if="!isAddDisabled" class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      {{ addButtonLabel }}
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppPrice from '@/shared/components/AppPrice.vue';
import { isActivityOrderable } from '@/shared/utils/activityOrderable.js';
import { stripHtml } from '@/shared/utils/html.js';
import ProductImageCarousel from './ProductImageCarousel.vue';

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  activity: {
    type: Object,
    default: null
  }
});

defineEmits(['add']);

const { t } = useI18n();
const isActivityAvailable = computed(() => isActivityOrderable(props.activity));
// 商品說明是後台富文字產生的 HTML，卡片只顯示純文字摘要（截斷由 scss 負責）。
const noteText = computed(() => stripHtml(props.product?.note));
const isAddDisabled = computed(() => Boolean(props.product?.isOutStock || !isActivityAvailable.value));
const addButtonLabel = computed(() => {
  if (!isActivityAvailable.value) return t('product.activityUnavailable');
  return props.product?.isOutStock ? t('product.soldOut') : t('product.addToCart');
});
</script>

<style scoped lang="scss">
@use '../styles/product-card';
</style>
