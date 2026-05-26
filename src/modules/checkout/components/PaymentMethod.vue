<template>
  <div class="payment-methods">
    <label v-for="method in PAYMENT_METHODS" :key="method.value" class="payment-option">
      <input
        type="radio"
        name="paymentMethod"
        :value="method.value"
        :checked="modelValue === method.value"
        @change="$emit('update:modelValue', method.value)"
      />
      <span>{{ t(method.labelKey) }}</span>
    </label>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { PAYMENT_METHODS } from '@/shared/constants/paymentMethods';

defineProps({
  modelValue: {
    type: String,
    default: 'credit-card'
  }
});

defineEmits(['update:modelValue']);

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/payment-method';
</style>
