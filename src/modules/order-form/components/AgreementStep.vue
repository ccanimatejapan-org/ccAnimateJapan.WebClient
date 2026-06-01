<template>
  <section class="order-form-card">
    <h2>{{ t(agreement?.titleKey || 'orderForm.agreement.title') }}</h2>
    <div class="order-form-agreement__sections">
      <section
        v-for="section in sections"
        :key="section.titleKey"
        class="order-form-agreement__section"
      >
        <h3>{{ t(section.titleKey) }}</h3>
        <ul class="order-form-list">
          <li v-for="item in section.itemKeys" :key="item">{{ t(item) }}</li>
        </ul>
      </section>
    </div>
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

const sections = [
  {
    titleKey: 'orderForm.agreement.sections.orderPayment.title',
    itemKeys: [
      'orderForm.agreement.sections.orderPayment.items.fullPayment',
      'orderForm.agreement.sections.orderPayment.items.minorConsent',
      'orderForm.agreement.sections.orderPayment.items.paymentDeadline'
    ]
  },
  {
    titleKey: 'orderForm.agreement.sections.shippingRefund.title',
    itemKeys: [
      'orderForm.agreement.sections.shippingRefund.items.transparentQuote',
      'orderForm.agreement.sections.shippingRefund.items.refundFormula',
      'orderForm.agreement.sections.shippingRefund.items.deliveryMethods'
    ]
  },
  {
    titleKey: 'orderForm.agreement.sections.notes.title',
    itemKeys: [
      'orderForm.agreement.sections.notes.items.internationalShipping',
      'orderForm.agreement.sections.notes.items.afterSales',
      'orderForm.agreement.sections.notes.items.arrivalTime',
      'orderForm.agreement.sections.notes.items.customerService'
    ]
  }
];

defineProps({
  agreement: {
    type: Object,
    default: null
  }
});
</script>
