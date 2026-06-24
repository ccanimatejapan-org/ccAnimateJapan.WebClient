<template>
  <nav v-if="totalPages > 1" class="app-pagination" :aria-label="t('common.pagination')">
    <button type="button" :disabled="page <= 1" @click="emit('update:page', page - 1)">
      ‹ {{ t('common.prevPage') }}
    </button>
    <span class="app-pagination__indicator">
      {{ t('common.pageIndicator', { current: page, total: totalPages }) }}
    </span>
    <button type="button" :disabled="page >= totalPages" @click="emit('update:page', page + 1)">
      {{ t('common.nextPage') }} ›
    </button>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  page: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:page']);
const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-pagination {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
}

.app-pagination button {
  min-height: 40px;
  border: 1px solid $color-border;
  border-radius: 8px;
  background: #fff;
  color: $color-primary;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.app-pagination button:disabled {
  color: $color-muted;
  cursor: not-allowed;
  opacity: 0.5;
}

.app-pagination__indicator {
  color: $color-ink;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}
</style>
