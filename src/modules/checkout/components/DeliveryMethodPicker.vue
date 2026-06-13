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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.method-picker__option {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid $color-border;
  border-radius: 999px;
  background: #fffdf9;
  color: $color-ink;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.16s ease, background 0.16s ease, color 0.16s ease;
}

.method-picker__option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.method-picker__option:hover {
  border-color: rgba(178, 106, 0, 0.4);
}

.method-picker__option.is-selected {
  border-color: $color-primary;
  background: #fff5e0;
  color: $color-primary;
}

.method-picker__option:focus-within {
  box-shadow: 0 0 0 4px rgba(184, 121, 22, 0.12);
}
</style>
