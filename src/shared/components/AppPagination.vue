<template>
  <nav v-if="totalPages > 1" class="app-pagination" :aria-label="t('common.pagination')">
    <button
      type="button"
      class="app-pagination__arrow"
      :aria-label="t('common.prevPage')"
      :disabled="page <= 1"
      @click="emit('update:page', page - 1)"
    >
      ‹
    </button>

    <ul class="app-pagination__pages">
      <li v-for="(item, index) in pageItems" :key="index">
        <span v-if="item === '…'" class="app-pagination__ellipsis">…</span>
        <button
          v-else
          type="button"
          class="app-pagination__page"
          :class="{ 'is-active': item === page }"
          :aria-current="item === page ? 'page' : undefined"
          @click="emit('update:page', item)"
        >
          {{ item }}
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="app-pagination__arrow"
      :aria-label="t('common.nextPage')"
      :disabled="page >= totalPages"
      @click="emit('update:page', page + 1)"
    >
      ›
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
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

const pageItems = computed(() => {
  const total = props.totalPages;
  const current = props.page;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const wanted = [...new Set([1, total, current, current - 1, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const result = [];
  let prev = 0;

  for (const p of wanted) {
    if (p - prev > 1) result.push('…');
    result.push(p);
    prev = p;
  }

  return result;
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 18px;
}

.app-pagination__pages {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-pagination__arrow,
.app-pagination__page {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid $color-border;
  border-radius: 8px;
  background: #fff;
  color: $color-primary;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-pagination__page.is-active {
  background: $color-primary;
  border-color: $color-primary;
  color: #fff;
  cursor: default;
}

.app-pagination__arrow:disabled {
  color: $color-muted;
  cursor: not-allowed;
  opacity: 0.5;
}

.app-pagination__ellipsis {
  min-width: 24px;
  text-align: center;
  color: $color-muted;
}
</style>
