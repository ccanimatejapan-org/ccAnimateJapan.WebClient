<template>
  <div class="address-picker">
    <label
      v-for="address in addresses"
      :key="address.id"
      class="address-picker__option"
      :class="{ 'is-selected': address.id === modelValue }"
    >
      <input
        type="radio"
        :value="address.id"
        :checked="address.id === modelValue"
        @change="$emit('update:modelValue', address.id)"
      />
      <span class="address-picker__text">
        <strong>{{ address.addressName || address.deliveryTypeName }}</strong>
        <small>{{ address.address }}</small>
      </span>
    </label>
    <label class="address-picker__option" :class="{ 'is-selected': modelValue === 0 }">
      <input type="radio" :value="0" :checked="modelValue === 0" @change="$emit('update:modelValue', 0)" />
      <span class="address-picker__text">
        <strong>{{ t('checkout.useNewAddress') }}</strong>
      </span>
    </label>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  addresses: { type: Array, default: () => [] },
  modelValue: { type: Number, default: 0 }
});
defineEmits(['update:modelValue']);

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.address-picker {
  display: grid;
  gap: 10px;
}

.address-picker__option {
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

.address-picker__option:hover {
  border-color: #e7cf8e;
}

.address-picker__option.is-selected {
  border-color: #b98f42;
  background: #fcf1d1;
}

.address-picker__option input {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin: 0;
  accent-color: #b98f42;
}

.address-picker__option:focus-within {
  outline: 3px solid #966419;
  outline-offset: 2px;
}

.address-picker__text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.address-picker__text strong {
  font-size: 0.9rem;
}

.address-picker__text small {
  color: $color-muted;
  font-size: 0.78rem;
  overflow-wrap: anywhere;
}
</style>
