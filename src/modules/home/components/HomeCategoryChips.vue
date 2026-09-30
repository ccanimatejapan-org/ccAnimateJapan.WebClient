<template>
  <div class="ui-chips" role="tablist" :aria-label="t('home.ongoing.title')">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="ui-chip"
      role="tab"
      :aria-selected="option.value === modelValue"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ t(option.label) }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
});

defineEmits(['update:modelValue']);

const { t } = useI18n();

const options = [
  { value: 'all', label: 'home.chips.all' },
  { value: 'preOrder', label: 'home.chips.preOrder' },
  { value: 'inStock', label: 'home.chips.inStock' }
];
</script>

