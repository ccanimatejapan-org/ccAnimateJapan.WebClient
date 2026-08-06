<template>
  <nav class="order-stage-tabs" :aria-label="t('order.tabsTitle')" role="tablist">
    <button
      v-for="option in stageOptions"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="option.value === normalizedStage"
      :class="[
        'order-stage-tabs__tab',
        option.value === normalizedStage ? 'order-stage-tabs__tab--active' : ''
      ]"
      @click="selectStage(option.value)"
    >
      {{ t(option.labelKey) }}
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

function selectStage(value) {
  emit('update:modelValue', value);
}
</script>
