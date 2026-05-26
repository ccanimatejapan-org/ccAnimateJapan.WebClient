<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    {{ t(ORDER_STATUS_LABELS[status] || 'order.status.unknown') }}
  </span>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ORDER_STATUS_LABELS } from '@/shared/constants/orderStatus';

defineProps({
  status: {
    type: String,
    required: true
  }
});

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '../styles/status-badge';
</style>
