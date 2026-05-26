<template>
  <Teleport to="body">
    <Transition name="app-toast">
      <aside v-if="ui.toast" class="app-toast" role="status" aria-live="polite">
        <div class="app-toast__mark">✓</div>
        <div class="app-toast__body">
          <strong>{{ ui.toast.title }}</strong>
          <p>{{ ui.toast.message }}</p>
        </div>
        <RouterLink
          v-if="ui.toast.actionTo"
          class="app-toast__action"
          :to="ui.toast.actionTo"
          @click="ui.hideToast"
        >
          {{ ui.toast.actionLabel }}
        </RouterLink>
        <button type="button" class="app-toast__close" :aria-label="t('common.close')" @click="ui.hideToast">
          ×
        </button>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/shared/stores/uiStore';

const { t } = useI18n();
const ui = useUiStore();
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-toast {
  position: fixed;
  right: clamp(16px, 4vw, 36px);
  bottom: clamp(16px, 4vw, 36px);
  z-index: 60;
  width: min(420px, calc(100vw - 32px));
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 14px 16px;
  border: 1px solid rgba(217, 128, 117, 0.32);
  border-radius: 22px;
  background: rgba(255, 252, 246, 0.96);
  box-shadow: 0 18px 44px rgba(106, 73, 61, 0.18);
  color: $color-ink;
  backdrop-filter: blur(16px);
}

.app-toast__mark {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: $color-accent;
  color: #fff;
  font-weight: 800;
}

.app-toast__body {
  display: grid;
  gap: 2px;
}

.app-toast__body p {
  margin: 0;
  color: $color-muted;
  font-size: 0.9rem;
}

.app-toast__action {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(184, 121, 22, 0.12);
  color: $color-primary;
  font-size: 0.9rem;
  font-weight: 800;
  white-space: nowrap;
}

.app-toast__close {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: $color-muted;
  cursor: pointer;
  font-size: 1.2rem;
}

.app-toast-enter-active,
.app-toast-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.app-toast-enter-from,
.app-toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@media (max-width: 640px) {
  .app-toast {
    right: 12px;
    bottom: 12px;
    left: 12px;
    width: auto;
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .app-toast__action {
    grid-column: 2 / 4;
    justify-self: start;
  }
}
</style>
