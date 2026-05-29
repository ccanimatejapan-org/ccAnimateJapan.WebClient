<template>
  <section class="order-form-card">
    <div v-if="store.products.length === 0" class="order-form-empty">
      {{ t('orderForm.noProducts') }}
    </div>

    <div v-else class="order-product-list">
      <article v-for="product in store.products" :key="product.id" class="order-product-row">
        <img :src="product.imageUrl" :alt="product.name" />
        <div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.info }}</p>
          <strong>{{ formatMoney(product.price) }}</strong>
        </div>
        <label>
          <span>{{ t('orderForm.products.quantity') }}</span>
          <input
            type="number"
            min="0"
            :max="product.amount || undefined"
            :value="store.quantities[product.id]"
            @input="store.setQuantity(product.id, $event.target.value)"
          />
        </label>
      </article>
    </div>

    <p v-if="store.fieldErrors.products" class="form-error">
      {{ t(store.fieldErrors.products) }}
    </p>

    <div class="order-form-total">
      <span>{{ t('orderForm.products.totalQuantity') }}：{{ store.totalQuantity }}</span>
      <strong>{{ t('orderForm.products.total') }}：{{ formatMoney(store.total) }}</strong>
    </div>

    <div class="order-form-actions">
      <AppButton variant="ghost" @click="store.previousStep">
        {{ t('orderForm.actions.previous') }}
      </AppButton>
      <AppButton @click="store.nextStep">{{ t('orderForm.actions.next') }}</AppButton>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { formatMoney } from '@/shared/utils/money';
import { useOrderFormStore } from '../stores/orderFormStore';

const { t } = useI18n();
const store = useOrderFormStore();
</script>
