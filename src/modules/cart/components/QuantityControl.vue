<template>
  <div class="quantity-control">
    <button type="button" @click="emitValue(modelValue - 1)">-</button>
    <input
      :value="modelValue"
      type="number"
      min="1"
      @input="emitValue(Number($event.target.value))"
    />
    <button type="button" @click="emitValue(modelValue + 1)">+</button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['update:modelValue']);

function emitValue(value) {
  emit('update:modelValue', Math.max(1, Math.floor(value) || 1));
}
</script>

<style scoped lang="scss">
@use '../styles/quantity-control';
</style>
