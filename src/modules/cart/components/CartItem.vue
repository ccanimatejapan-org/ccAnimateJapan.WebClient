<template>
  <article class="cart-item">
    <img :src="item.imageUrl" :alt="item.productName" />
    <div class="cart-item__body">
      <p>{{ item.activityName }}</p>
      <h3>{{ item.productName }}</h3>
      <span v-if="item.note">{{ item.note }}</span>
      <div class="cart-item__price-row">
        <span>{{ t('cart.unitPrice') }}</span>
        <AppPrice :value="item.price" />
      </div>
      <div class="cart-item__price-row">
        <span>{{ t('cart.lineSubtotal') }}</span>
        <AppPrice :value="item.price * item.quantity" />
      </div>
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
