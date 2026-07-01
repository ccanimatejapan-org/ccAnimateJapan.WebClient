<template>
  <div class="quantity-control">
    <button type="button" @click="emitValue(modelValue - 1)">-</button>
    <input
      :value="modelValue"
      type="number"
      min="1"
      :max="MAX_ORDER_QUANTITY"
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
  }
});

const emit = defineEmits(['update:modelValue']);

function emitValue(value) {
  emit('update:modelValue', clampQuantity(value));
}
</script>

<style scoped lang="scss">
@use '../styles/quantity-control';
</style>
