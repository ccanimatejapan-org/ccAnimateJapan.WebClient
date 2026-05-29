<template>
  <nav class="order-form-steps" :aria-label="t('orderForm.stepsLabel')">
    <button
      v-for="step in steps"
      :key="step.value"
      type="button"
      class="order-form-steps__item"
      :class="{ active: currentStep === step.value, done: currentStep > step.value }"
      @click="$emit('select', step.value)"
    >
      {{ t(step.labelKey) }}
    </button>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  currentStep: {
    type: Number,
    required: true
  }
});

defineEmits(['select']);

const steps = [
  { value: 1, labelKey: 'orderForm.steps.agreement' },
  { value: 2, labelKey: 'orderForm.steps.basicInfo' },
  { value: 3, labelKey: 'orderForm.steps.products' },
  { value: 4, labelKey: 'orderForm.steps.preview' }
];
</script>
