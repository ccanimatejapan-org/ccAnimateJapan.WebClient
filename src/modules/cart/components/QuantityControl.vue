<template>
  <div class="quantity-control">
    <button type="button" @click="emitValue(modelValue - 1)">-</button>
    <input
      :value="modelValue"
      type="number"
      min="1"
      :max="max"
      @input="emitValue(Number($event.target.value))"
    />
    <button type="button" @click="emitValue(modelValue + 1)">+</button>
  </div>
</template>

<script setup>
import { MAX_ORDER_QUANTITY, clampQuantity } from '@/shared/constants/quantity';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: MAX_ORDER_QUANTITY
  }
});

const emit = defineEmits(['update:modelValue', 'limit-reached']);

function emitValue(value) {
  if (Number(value) > props.max) emit('limit-reached');
  emit('update:modelValue', clampQuantity(value, props.max));
}
</script>

<style scoped lang="scss">
@use '../styles/quantity-control';
</style>
