<template>
  <div ref="root" class="custom-select">
    <button
      ref="trigger"
      class="custom-select__trigger"
      type="button"
      :id="triggerId"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="menuId"
      :aria-labelledby="triggerAriaLabelledBy"
      :aria-invalid="Boolean(invalid)"
      :aria-describedby="descriptionId"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <span class="custom-select__text">{{ selectedLabel || placeholder }}</span>
      <span class="custom-select__chevron" aria-hidden="true">▾</span>
    </button>

    <div
      v-if="isOpen"
      ref="menu"
      :id="menuId"
      class="custom-select__menu"
      role="listbox"
      tabindex="-1"
      :aria-labelledby="triggerId"
      :aria-label="descriptionId ? undefined : placeholder"
      @keydown="handleMenuKeydown"
      @click="handleMenuClick"
    >
      <slot
        :is-option-selected="isOptionValueSelected"
        :set-value="setValue"
        :close="() => closeMenu()"
      >
        <button
          v-for="item in options"
          :key="item.value"
          type="button"
          class="custom-select__option"
          role="option"
          :data-value="String(item.value)"
          :data-disabled="item.disabled ? 'true' : 'false'"
          :id="getOptionElementId(item.value)"
          :disabled="item.disabled"
          :aria-selected="isOptionValueSelected(item.value)"
          @click.stop="setValue(item.value)"
        >
          {{ item.label }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    required: true
  },
  selectedLabel: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  },
  labelId: {
    type: String,
    default: ''
  },
  descriptionId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'open', 'close']);

const root = ref(null);
const trigger = ref(null);
const menu = ref(null);
const isOpen = ref(false);
const isUpdatingValue = ref(false);
const rootSelectId = computed(() => props.id || `custom-select-${Math.random().toString(36).slice(2)}`);
const triggerId = computed(() => `${rootSelectId.value}-trigger`);
const menuId = computed(() => `${rootSelectId.value}-menu`);
const isOpenAnimating = ref(false);
const triggerAriaLabelledBy = computed(() => {
  return props.labelId ? `${props.labelId} ${triggerId.value}` : triggerId.value;
});

function normalizeValue(value) {
  return value === null || value === undefined ? '' : String(value);
}

const selectedNormalizedValue = computed(() => normalizeValue(props.modelValue));

function optionElements() {
  return menu.value ? Array.from(menu.value.querySelectorAll('[role="option"]')) : [];
}

function isOptionValueSelected(value) {
  return normalizeValue(value) === selectedNormalizedValue.value;
}

function getValueFromOption(option) {
  return option?.getAttribute?.('data-value') ?? '';
}

function getOptionElementId(value) {
  return `${menuId.value}-option-${normalizeValue(value)}`;
}

function isOptionDisabled(option) {
  return option?.disabled || option?.getAttribute?.('aria-disabled') === 'true' || option?.getAttribute?.('data-disabled') === 'true';
}

function setValue(value) {
  if (isUpdatingValue.value) return;

  const normalized = normalizeValue(value);
  if (normalized === selectedNormalizedValue.value) {
    closeMenu();
    return;
  }

  isUpdatingValue.value = true;
  emit('update:modelValue', value);
  closeMenu();

  queueMicrotask(() => {
    isUpdatingValue.value = false;
  });
}

function toggle() {
  if (props.disabled) return;
  if (isOpen.value) {
    closeMenu({ focusTrigger: true });
  } else {
    openMenu();
  }
}

function openMenu() {
  if (props.disabled || isOpen.value || isOpenAnimating.value) return;

  isOpenAnimating.value = true;
  isOpen.value = true;
  emit('open');

  nextTick(() => {
    const options = optionElements();
    const selected = options.findIndex((option) => isOptionValueSelected(getValueFromOption(option)));
    const targetIndex = selected >= 0 ? selected : 0;
    focusOptionAt(targetIndex);
    if (menu.value && !options.length) menu.value?.setAttribute('aria-label', props.placeholder);

    isOpenAnimating.value = false;
  });
}

function closeMenu({ focusTrigger = false } = {}) {
  if (!isOpen.value) return;

  isOpen.value = false;
  emit('close');
  if (focusTrigger) {
    trigger.value?.focus();
  }
}

function onDocumentPointerDown(event) {
  if (!isOpen.value) return;
  if (!root.value?.contains(event.target)) {
    closeMenu();
  }
}

function focusOptionAt(index) {
  const options = optionElements();
  const target = options[index];
  options.forEach((option) => {
    option.setAttribute('tabindex', '-1');
  });
  if (target) {
    target.setAttribute('tabindex', '0');
    target.focus();
  }
}

function getEnabledOptionIndexes() {
  return optionElements()
    .map((option, index) => (isOptionDisabled(option) ? null : index))
    .filter((index) => index !== null);
}

function moveToFirstEnabledOption() {
  const enabled = getEnabledOptionIndexes();
  if (enabled.length) focusOptionAt(enabled[0]);
}

function moveToLastEnabledOption() {
  const enabled = getEnabledOptionIndexes();
  if (enabled.length) focusOptionAt(enabled[enabled.length - 1]);
}

function moveOption(step) {
  const enabled = getEnabledOptionIndexes();
  if (!enabled.length) return;

  const focused = optionElements().findIndex((option) => option === document.activeElement);
  const focusedEnabledIndex = enabled.findIndex((index) => index === focused);
  if (focusedEnabledIndex === -1) {
    focusOptionAt(enabled[0]);
    return;
  }

  const nextEnabledIndex = (focusedEnabledIndex + step + enabled.length) % enabled.length;
  focusOptionAt(enabled[nextEnabledIndex]);
}

function selectActiveOption() {
  const active = optionElements().find((option) => option === document.activeElement);
  if (!active) return;
  if (isOptionDisabled(active)) return;

  const value = getValueFromOption(active);
  if (!value) return;

  setValue(value);
}

function handleMenuClick(event) {
  const option = event.target?.closest?.('[role="option"]');
  if (!option || isOptionDisabled(option)) return;
  const value = getValueFromOption(option);
  setValue(value);
}

function handleMenuKeydown(event) {
  if (event.key === 'Tab') {
    closeMenu();
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    moveToFirstEnabledOption();
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    moveToLastEnabledOption();
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveOption(1);
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveOption(-1);
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    selectActiveOption();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu();
  }
}

function handleTriggerKeydown(event) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    openMenu();
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu();
  }
}

function clearDescriptionIfNeeded() {
  if (!isOpen.value && menu.value) {
    menu.value.removeAttribute('aria-label');
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
});

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
});

onBeforeUnmount(clearDescriptionIfNeeded);

watch(
  () => isOpen.value,
  (value) => {
    if (!value) return;
    nextTick(() => menu.value?.setAttribute('aria-labelledby', triggerId.value));
  }
);

watch(
  () => props.disabled,
  (isDisabled) => {
    if (isDisabled) {
      closeMenu();
    }
  }
);
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.custom-select {
  position: relative;
}

.custom-select__trigger {
  width: 100%;
  min-width: 0;
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 14px;
  border: 1px solid $color-border;
  border-radius: 10px;
  background: #fff;
  color: $color-ink;
  cursor: pointer;
}

.custom-select__trigger:focus-visible {
  outline: none;
  border-color: $color-primary;
  box-shadow: 0 0 0 3px rgba($color-primary, 0.15);
}

.custom-select__trigger:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.custom-select__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-select__chevron {
  color: $color-muted;
}

.custom-select__menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 3;
  display: grid;
  gap: 2px;
  max-height: min(220px, 40vh);
  overflow-y: auto;
  padding: 4px;
  border: 1px solid $color-border;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(50, 35, 20, 0.14);
}

.custom-select__option {
  width: 100%;
  min-width: 0;
  padding: 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: $color-ink;
  text-align: left;
  overflow-wrap: anywhere;
  cursor: pointer;
}

.custom-select__option:hover,
.custom-select__option:focus-visible,
.custom-select__option[aria-selected='true'] {
  background: #fcf1d1;
  color: $color-primary;
  outline: none;
}

.custom-select__option:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.custom-select__option:focus-visible {
  outline: 2px solid rgba($color-primary, 0.25);
}
</style>
