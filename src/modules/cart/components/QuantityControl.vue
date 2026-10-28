<template>
  <div class="quantity-control" :class="{ 'is-disabled': disabled }">
    <button type="button" :aria-label="t('common.decrease')" :disabled="disabled" @click="emitValue(modelValue - 1)">−</button>
    <input
      :value="modelValue"
      type="number"
      min="1"
      :max="max"
      inputmode="numeric"
      :disabled="disabled"
      :aria-label="t('product.addDialog.quantity')"
      @input="emitValue(Number($event.target.value))"
    />
    <button type="button" :aria-label="t('common.increase')" :disabled="disabled" @click="emitValue(modelValue + 1)">+</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { MAX_ORDER_QUANTITY, clampQuantity } from '@/shared/constants/quantity';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: MAX_ORDER_QUANTITY
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'limit-reached']);
const { t } = useI18n();

function emitValue(value) {
  if (Number(value) > props.max) emit('limit-reached');
  emit('update:modelValue', clampQuantity(value, props.max));
}
</script>

<style scoped lang="scss">
@use '../styles/quantity-control';
</style>
