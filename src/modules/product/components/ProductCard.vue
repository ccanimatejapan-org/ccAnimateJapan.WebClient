<template>
  <article v-if="product" class="product-card">
    <img :src="product.imageUrl" :alt="product.name" loading="lazy" />
    <div class="product-card__body">
      <p v-if="product.productTypeName">{{ product.productTypeName }}</p>
      <h3>{{ product.name }}</h3>
      <span v-if="product.note" class="product-card__note">{{ product.note }}</span>
      <AppPrice :value="product.price" />
      <AppButton :disabled="isAddDisabled" @click="$emit('add', product)">
        {{ addButtonLabel }}
      </AppButton>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppPrice from '@/shared/components/AppPrice.vue';

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
const ACTIVITY_STATUS_ENDED = 4;

const isActivityEnded = computed(() => props.activity?.status === ACTIVITY_STATUS_ENDED);
const isAddDisabled = computed(() => Boolean(props.product?.isOutStock || isActivityEnded.value));
const addButtonLabel = computed(() => {
  if (isActivityEnded.value) return t('product.activityEnded');
  return props.product?.isOutStock ? t('product.soldOut') : t('product.addToCart');
});
</script>

<style scoped lang="scss">
@use '../styles/product-card';
</style>
