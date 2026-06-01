<template>
  <section class="order-form-card">
    <div v-if="store.submitResult" class="order-form-success">
      <p class="eyebrow">{{ t('orderForm.success.title') }}</p>
      <h2>{{ t('orderForm.success.orderId') }}：{{ store.submitResult.id }}</h2>
      <p>{{ t('orderForm.success.message') }}</p>
    </div>

    <template v-else>
      <section class="order-preview-section">
        <h2>{{ t('orderForm.preview.contact') }}</h2>
        <p>{{ store.form.subscriberName }}</p>
        <p>{{ store.form.subscriberEmail }}</p>
        <p>{{ t('orderForm.preview.bank') }}：{{ store.form.subscriberBank }}</p>
        <p v-if="store.selectedDeliveryType">
          {{ t('orderForm.preview.deliveryType') }}：{{ store.selectedDeliveryType.name }}
        </p>
      </section>

      <section class="order-preview-section">
        <h2>{{ t('orderForm.preview.items') }}</h2>
        <article v-for="item in store.selectedItems" :key="item.productId" class="order-preview-item">
          <div class="order-preview-item__main">
            <span>{{ item.name }} × {{ item.amount }}</span>
            <small v-if="item.info">{{ t('orderForm.products.note') }}：{{ item.info }}</small>
          </div>
          <strong>{{ formatMoney(item.subTotal) }}</strong>
        </article>
        <div class="order-form-total">
          <strong>{{ t('orderForm.products.total') }}：{{ formatMoney(store.total) }}</strong>
        </div>
      </section>

      <p v-if="store.submitError" class="form-error">
        {{ t(store.submitError.message || 'orderForm.errors.submitFailed') }}
      </p>

      <div class="order-form-actions">
        <AppButton variant="ghost" @click="store.previousStep">
          {{ t('orderForm.preview.edit') }}
        </AppButton>
        <AppButton :disabled="store.isSubmitting" @click="store.submitOrder">
          {{ t('orderForm.preview.submit') }}
        </AppButton>
      </div>
    </template>
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
