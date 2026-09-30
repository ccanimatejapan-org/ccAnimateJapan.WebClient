<template>
  <button
    type="button"
    class="language-toggle"
    :aria-label="t('nav.language')"
    aria-haspopup="dialog"
    @click="isOpen = true"
  >
    <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" />
    </svg>
    <span>{{ currentLabel }}</span>
  </button>

  <AppModal v-model="isOpen" :title="t('nav.languageTitle')" fit-content>
    <div class="language-options">
      <button
        v-for="item in locales"
        :key="item.code"
        type="button"
        class="language-option"
        :aria-pressed="isActive(item.code)"
        :lang="item.code"
        @click="select(item.code)"
      >
        <span>
          <strong>{{ item.name }}</strong>
          <small>{{ item.hint }}</small>
        </span>
        <svg class="ui-icon language-option__check" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 12 4 4L19 6" />
        </svg>
      </button>
    </div>
  </AppModal>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppModal from '@/shared/components/AppModal.vue';
import { useLocale } from '@/shared/composables/useLocale';

const { t } = useI18n();
const { current, locales, isActive, change } = useLocale();
const isOpen = ref(false);

const currentLabel = computed(
  () => locales.find((item) => item.code === current.value)?.label ?? current.value
);

function select(code) {
  change(code);
  isOpen.value = false;
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.language-toggle {
  min-width: 66px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px;
  border: 1px solid $color-border;
  border-radius: $radius-control;
  background: #fffdf7;
  color: $color-ink;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.language-toggle .ui-icon {
  width: 17px;
  height: 17px;
}

.language-options {
  display: grid;
  gap: 12px;
}

.language-option {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border: 1px solid $color-border;
  border-radius: 14px;
  background: $color-paper;
  color: $color-ink;
  text-align: left;
  cursor: pointer;
}

.language-option strong,
.language-option small {
  display: block;
}

.language-option strong {
  font-size: 1.05rem;
}

.language-option small {
  margin-top: 4px;
  color: $color-muted;
}

.language-option[aria-pressed='true'] {
  border-color: #b98f42;
  background: #fcf1d1;
}

.language-option__check {
  display: none;
  color: #78571f;
}

.language-option[aria-pressed='true'] .language-option__check {
  display: block;
}

@media (max-width: 399px) {
  .language-toggle {
    min-width: 58px;
    padding: 6px;
  }
}
</style>
