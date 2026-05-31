<template>
  <article class="product-card">
    <img :src="product.imageUrl" :alt="product.name" loading="lazy" />
    <div class="product-card__body">
      <p>{{ product.category }}</p>
      <h3>{{ product.name }}</h3>
      <span v-if="product.note" class="product-card__note">{{ product.note }}</span>
      <AppPrice :value="product.price" />
      <AppButton @click="$emit('add', product)">
        {{ t('product.addToCart') }}
      </AppButton>
    </div>
  </article>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppPrice from '@/shared/components/AppPrice.vue';

defineProps({
  product: {
    type: Object,
    required: true
  }
});

defineEmits(['add']);

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/product-card';
</style>
