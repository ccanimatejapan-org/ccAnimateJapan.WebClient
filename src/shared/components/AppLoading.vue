<template>
  <div class="app-loading" role="status">
    <span class="app-loading__spinner" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Loading'
  }
});
</script>
