<template>
  <span class="status-badge" :class="`status-badge--${badgeVariant}`">
    {{ t(labelKey) }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  getOrderStatusBadgeVariant,
  getOrderStatusLabelKey
} from '@/shared/constants/orderStatus';

const props = defineProps({
  orderStatus: {
    type: [Number, String],
    required: true
  }
});

const { t } = useI18n();

const labelKey = computed(() => getOrderStatusLabelKey(props.orderStatus));
const badgeVariant = computed(() => getOrderStatusBadgeVariant(props.orderStatus));
</script>

<style scoped lang="scss">
@use '../styles/status-badge';
</style>
