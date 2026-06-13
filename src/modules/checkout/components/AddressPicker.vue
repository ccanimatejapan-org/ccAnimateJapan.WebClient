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
  gap: 8px;
}

.address-picker__option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid $color-border;
  border-radius: 14px;
  background: #fffdf9;
  cursor: pointer;
  transition: border-color 0.16s ease, background 0.16s ease;
}

.address-picker__option:hover {
  border-color: rgba(178, 106, 0, 0.4);
}

.address-picker__option.is-selected {
  border-color: $color-primary;
  background: #fff5e0;
}

.address-picker__option input {
  width: 18px;
  height: 18px;
  accent-color: $color-primary;
}

.address-picker__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.address-picker__text strong {
  color: $color-ink;
}

.address-picker__text small {
  color: $color-muted;
}
</style>
