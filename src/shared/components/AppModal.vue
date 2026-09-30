<template>
  <Teleport to="body">
    <div v-if="modelValue" class="app-modal" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <div class="app-modal__backdrop" @click="close" />
      <section
        class="app-modal__panel"
        :class="{ 'app-modal__panel--fit-content': fitContent }"
      >
        <div class="app-modal__handle" aria-hidden="true" />
        <header class="app-modal__header">
          <h2 :id="titleId">{{ title }}</h2>
          <button type="button" class="app-modal__close" :aria-label="t('common.closeDialog')" @click="close">
            <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </button>
        </header>
        <div class="app-modal__body">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  fitContent: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);
const { t } = useI18n();
const titleId = `app-modal-title-${Math.random().toString(36).slice(2, 9)}`;

function close() {
  emit('update:modelValue', false);
}

function onKeydown(event) {
  if (event.key === 'Escape') close();
}

function lockBodyScroll(locked) {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = locked ? 'hidden' : '';
  if (locked) {
    window.addEventListener('keydown', onKeydown);
  } else {
    window.removeEventListener('keydown', onKeydown);
  }
}

watch(() => props.modelValue, lockBodyScroll, { immediate: true });

onBeforeUnmount(() => lockBodyScroll(false));
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
  background: rgba(41, 37, 29, 0.46);
  backdrop-filter: blur(3px);
}

.app-modal__panel {
  position: relative;
  width: 100%;
  max-height: 90vh;
  max-height: 90dvh;
  overflow: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  border-radius: $radius-sheet $radius-sheet 0 0;
  background: $color-canvas;
  color: $color-ink;
  box-shadow: 0 -10px 60px rgba(48, 38, 25, 0.13);
}

.app-modal__handle {
  flex-shrink: 0;
  width: 35px;
  height: 4px;
  margin: 10px auto 0;
  border-radius: 4px;
  background: #d8d1c3;
}

.app-modal__header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 12px 10px 20px;
  border-bottom: 1px solid $color-border;
  background: $color-canvas;
}

.app-modal__header h2 {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.35;
}

.app-modal__close {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: $color-ink;
  cursor: pointer;
}

.app-modal__close:hover {
  background: #efeadd;
}

.app-modal__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px 20px calc(24px + env(safe-area-inset-bottom));
}

@media (min-width: 700px) {
  .app-modal {
    align-items: center;
    justify-items: center;
    padding: 24px;
  }

  .app-modal__panel {
    width: min(520px, 100%);
    max-height: 86vh;
    max-height: 86dvh;
    border-radius: $radius-sheet;
  }

  .app-modal__handle {
    display: none;
  }

  .app-modal__header {
    padding-top: 12px;
  }
}
</style>
