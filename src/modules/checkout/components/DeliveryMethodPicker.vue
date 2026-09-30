<template>
  <div class="method-picker">
    <label
      v-for="type in deliveryTypes"
      :key="type.id"
      class="method-picker__option"
      :class="{ 'is-selected': type.id === modelValue }"
    >
      <input
        type="radio"
        :value="type.id"
        :checked="type.id === modelValue"
        @change="$emit('update:modelValue', type.id)"
      />
      <span>{{ type.name }}</span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  deliveryTypes: { type: Array, default: () => [] },
  modelValue: { type: Number, default: null }
});
defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.method-picker {
  display: grid;
  gap: 10px;
}

.method-picker__option {
  position: relative;
  min-height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid $color-border;
  border-radius: 14px;
  background: $color-paper;
  color: $color-ink;
  cursor: pointer;
  transition: border-color 0.16s ease, background 0.16s ease;
}

.method-picker__option:hover {
  border-color: #e7cf8e;
}

.method-picker__option.is-selected {
  border-color: #b98f42;
  background: #fcf1d1;
}

.method-picker__option input {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin: 0;
  accent-color: #b98f42;
}

.method-picker__option:focus-within {
  outline: 3px solid #966419;
  outline-offset: 2px;
}

.method-picker__option {
  font-size: 0.9rem;
  font-weight: 650;
}
</style>
