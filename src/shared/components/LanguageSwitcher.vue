<template>
  <div class="language-switcher" role="group" :aria-label="t('nav.language')">
    <button
      v-for="item in locales"
      :key="item.code"
      type="button"
      class="language-switcher__option"
      :class="{ 'language-switcher__option--active': isActive(item.code) }"
      :aria-pressed="isActive(item.code)"
      @click="change(item.code)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/shared/composables/useLocale';

const { t } = useI18n();
const { locales, isActive, change } = useLocale();
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid $color-border;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
}

.language-switcher__option {
  min-height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: $color-muted;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease;
}

.language-switcher__option--active {
  color: $color-primary;
  background: rgba(184, 121, 22, 0.08);
}

.language-switcher__option:focus-visible {
  outline: 2px solid rgba(184, 121, 22, 0.34);
  outline-offset: 2px;
}
</style>
