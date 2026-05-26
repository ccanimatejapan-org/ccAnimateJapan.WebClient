<template>
  <section class="app-empty">
    <p>{{ message }}</p>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'No data'
  }
});
</script>
