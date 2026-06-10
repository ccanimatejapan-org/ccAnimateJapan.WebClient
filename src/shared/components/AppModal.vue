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

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  align-items: end;
}

.app-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(21, 29, 45, 0.42);
}

.app-modal__panel {
  position: relative;
  width: 100%;
  height: min(70vh, 600px);
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border-radius: 16px 16px 0 0;
  background: #fff;
  box-shadow: 0 -18px 50px rgba(21, 29, 45, 0.18);
}

.app-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.app-modal__header h2 {
  margin: 0;
  line-height: 1.25;
}

.icon-button {
  width: 38px;
  height: 38px;
  border: 1px solid $color-border;
  border-radius: 999px;
  background: #fff;
  color: $color-muted;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 900;
}

@media (min-width: 640px) {
  .app-modal {
    align-items: center;
    justify-items: center;
    padding: 24px;
  }

  .app-modal__panel {
    width: min(520px, 100%);
    border-radius: 8px;
  }
}
</style>
