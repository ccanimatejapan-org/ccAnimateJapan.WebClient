<template>
  <Teleport to="body">
    <Transition name="app-toast">
      <aside
        v-if="ui.toast"
        class="app-toast"
        :class="{ 'app-toast--warning': ui.toast.type === 'warning' }"
        role="status"
        aria-live="polite"
      >
        <div class="app-toast__mark">{{ ui.toast.type === 'warning' ? '!' : '✓' }}</div>
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
  left: 50%;
  bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 100;
  width: min(440px, calc(100% - 32px));
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px 10px 12px 16px;
  border-radius: $radius-control;
  background: rgba(48, 45, 39, 0.94);
  box-shadow: 0 18px 44px rgba(48, 38, 25, 0.22);
  color: #fff;
  font-size: 0.87rem;
  transform: translateX(-50%);
}

.app-toast__mark {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: $color-yellow;
  color: $color-ink;
  font-weight: 800;
}

.app-toast--warning .app-toast__mark {
  background: #e8b4a4;
}

.app-toast__body {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.app-toast__body strong,
.app-toast__body p {
  margin: 0;
  overflow-wrap: anywhere;
}

.app-toast__body p {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.8rem;
}

.app-toast__action {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 10px;
  background: $color-yellow;
  color: $color-ink;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

.app-toast__close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  font-size: 1.2rem;
}

.app-toast-enter-active,
.app-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.app-toast-enter-from,
.app-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

@media (max-width: 520px) {
  .app-toast {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .app-toast__action {
    grid-column: 2 / 4;
    justify-self: start;
  }
}
</style>
