<template>
  <nav ref="tabsRef" class="order-stage-tabs ui-chips" :aria-label="t('order.tabsTitle')" role="tablist">
    <button
      v-for="option in stageOptions"
      :key="option.value"
      type="button"
      role="tab"
      class="ui-chip order-stage-tabs__tab"
      :aria-selected="option.value === normalizedStage"
      @click="selectStage(option.value)"
    >
      {{ t(option.labelKey) }}
    </button>
  </nav>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
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

const tabsRef = ref(null);

const normalizedStage = computed(() => normalizeOrderStage(props.modelValue) ?? DEFAULT_ORDER_STAGE);

async function scrollActiveTabIntoView() {
  await nextTick();
  const container = tabsRef.value;
  const activeTab = container?.querySelector('[aria-selected="true"]');

  if (!container || !activeTab) {
    return;
  }

  const left = activeTab.offsetLeft - (container.clientWidth - activeTab.offsetWidth) / 2;
  container.scrollTo({ left: Math.max(left, 0), behavior: 'smooth' });
}

onMounted(scrollActiveTabIntoView);
watch(normalizedStage, scrollActiveTabIntoView);

function selectStage(value) {
  emit('update:modelValue', value);
}
</script>

<style scoped lang="scss">
@use '../styles/order-stage-tabs';
</style>
