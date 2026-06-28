<template>
  <span class="status-badge" :class="`status-badge--${variant}`">{{ label }}</span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'unknown'
  },
  label: {
    type: String,
    required: true
  }
});
</script>

<style scoped lang="scss">
@use '../styles/status-badge';
</style>
