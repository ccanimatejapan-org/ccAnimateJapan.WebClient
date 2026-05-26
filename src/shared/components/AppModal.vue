<template>
  <Teleport to="body">
    <div v-if="modelValue" class="app-modal" role="dialog" aria-modal="true">
      <div class="app-modal__backdrop" @click="$emit('update:modelValue', false)" />
      <section class="app-modal__panel">
        <header class="app-modal__header">
          <h2>{{ title }}</h2>
          <button type="button" class="icon-button" @click="$emit('update:modelValue', false)">
            x
          </button>
        </header>
        <slot />
      </section>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>
