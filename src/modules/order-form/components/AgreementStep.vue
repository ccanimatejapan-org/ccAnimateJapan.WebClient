<template>
  <section class="order-form-card">
    <h2>{{ t(agreement?.titleKey || 'orderForm.agreement.title') }}</h2>
    <ul class="order-form-list">
      <li v-for="item in agreement?.contentKeys" :key="item">{{ t(item) }}</li>
    </ul>
    <label class="order-form-check">
      <input v-model="store.form.agreedToTerms" type="checkbox" />
      <span>{{ t('orderForm.agreement.checkbox') }}</span>
    </label>
    <p v-if="store.fieldErrors.agreedToTerms" class="form-error">
      {{ t(store.fieldErrors.agreedToTerms) }}
    </p>
    <AppButton @click="store.nextStep">{{ t('orderForm.actions.next') }}</AppButton>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { useOrderFormStore } from '../stores/orderFormStore';

const { t } = useI18n();
const store = useOrderFormStore();

defineProps({
  agreement: {
    type: Object,
    default: null
  }
});
</script>
