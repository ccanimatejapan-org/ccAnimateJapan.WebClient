<template>
  <span class="app-price">{{ formattedValue }}</span>
</template>

<script setup>
import { computed } from 'vue';
import { formatMoney } from '@/shared/utils/money';

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'TWD'
  }
});

const formattedValue = computed(() => formatMoney(props.value, props.currency));
</script>
