<template>
  <div class="product-filter">
    <button
      v-for="category in categories"
      :key="category.value"
      type="button"
      :class="{ active: modelValue === category.value }"
      @click="$emit('update:modelValue', category.value)"
    >
      {{ t(category.labelKey) }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
});

defineEmits(['update:modelValue']);

const { t } = useI18n();
const categories = [
  { value: 'all', labelKey: 'product.category.all' },
  { value: 'figure', labelKey: 'product.category.figure' },
  { value: 'goods', labelKey: 'product.category.goods' },
  { value: 'book', labelKey: 'product.category.book' }
];
</script>

<style scoped lang="scss">
@use '../styles/product-filter';
</style>
