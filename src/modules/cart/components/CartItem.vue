<template>
  <article class="cart-item">
    <img :src="item.imageUrl" :alt="item.name" />
    <div>
      <h3>{{ item.name }}</h3>
      <AppPrice :value="item.price" />
    </div>
    <QuantityControl :model-value="item.quantity" @update:model-value="cart.updateQuantity(item.id, $event)" />
    <button type="button" class="text-button" @click="cart.removeItem(item.id)">
      {{ t('common.remove') }}
    </button>
  </article>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppPrice from '@/shared/components/AppPrice.vue';
import QuantityControl from './QuantityControl.vue';
import { useCartStore } from '../stores/cartStore';

defineProps({
  item: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();
const cart = useCartStore();
</script>

<style scoped lang="scss">
@use '../styles/cart-item';
</style>
