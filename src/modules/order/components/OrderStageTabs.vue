<template>
  <nav class="order-stage-tabs" :aria-label="t('order.tabsTitle')" role="tablist">
    <button
      v-for="(option, index) in stageOptions"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="option.value === normalizedStage"
      :class="[
        'order-stage-tabs__tab',
        option.value === normalizedStage ? 'order-stage-tabs__tab--active' : '',
        index < activeStageIndex ? 'order-stage-tabs__tab--completed' : ''
      ]"
      @click="selectStage(option.value)"
    >
      <span class="order-stage-tabs__step" aria-hidden="true">
        <svg
          v-if="index < activeStageIndex"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6.5 12.5 3.5 3.5 7.5-8" />
        </svg>
        <span v-else>{{ index + 1 }}</span>
      </span>
      <span class="order-stage-tabs__label">{{ t(option.labelKey) }}</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { DEFAULT_ORDER_STAGE, normalizeOrderStage, ORDER_STAGES } from '../utils/orderStages';

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: DEFAULT_ORDER_STAGE
  }
});

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

const stageOptions = ORDER_STAGES;

const normalizedStage = computed(() => normalizeOrderStage(props.modelValue) ?? DEFAULT_ORDER_STAGE);
const activeStageIndex = computed(() => (
  stageOptions.findIndex((option) => option.value === normalizedStage.value)
));

function selectStage(value) {
  emit('update:modelValue', value);
}
</script>

<style scoped lang="scss">
@use '../styles/order-stage-tabs';
</style>
