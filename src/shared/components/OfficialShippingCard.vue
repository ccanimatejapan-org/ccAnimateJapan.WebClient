<template>
  <section
    v-if="display.status !== 'hidden'"
    class="official-shipping-card"
    :class="`official-shipping-card--${variant}`"
    role="group"
    :aria-label="t('officialShipping.title')"
  >
    <div class="official-shipping-card__heading">
      <svg
        class="official-shipping-card__truck"
        viewBox="0 0 24 24"
        role="img"
        aria-label="truck"
      >
        <path
          d="M5 17a3 3 0 1 1 5.195 2H9l-2.4 2.4a1 1 0 0 1-1.4 0L5 19.4V17Zm9 0a3 3 0 0 1 3 3v.6l-2.6-2.6h-.4a3 3 0 0 1 0-1Zm4 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-.68L18.6 21H8.4l-.4-2h11.6l-.4-2h-1a3 3 0 0 1-2.8-3ZM6 7h11.5l2.5 6v2h-2.17L16 13h-9L6 7Zm0 0-2.22-1.48A2 2 0 0 0 1.5 7.26 2 2 0 0 0 2.22 10H4Zm13.12 7H9v2h11.88a1 1 0 1 1 0 2H9.7a5 5 0 1 1-6-5h5.42L10.85 5.6A2 2 0 0 1 12.72 4h4.28l3 3v6Z"
          fill="currentColor"
        />
      </svg>
      <p class="official-shipping-card__title" aria-hidden="true">{{ t('officialShipping.title') }}</p>
    </div>
    <p class="official-shipping-card__value">
      {{ display.status === 'ready' ? display.range : t('officialShipping.pending') }}
    </p>
    <p v-if="variant === 'full'" class="official-shipping-card__description">
      {{ t('officialShipping.description') }}
    </p>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getOfficialShippingDisplay } from '@/shared/utils/officialShipping.js';

const props = defineProps({
  isPreOrder: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    default: null
  },
  endTime: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'compact'
  }
});

const { locale, t } = useI18n();

const display = computed(() =>
  getOfficialShippingDisplay(
    {
      isPreOrder: props.isPreOrder,
      startTime: props.startTime,
      endTime: props.endTime
    },
    locale.value
  )
);
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.official-shipping-card {
  display: grid;
  gap: 6px;
  border: 1px solid rgba($color-primary, 0.22);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba($color-surface, 0.88), rgba($color-canvas, 0.92));
  color: $color-ink;
}

.official-shipping-card__heading {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.official-shipping-card__truck {
  flex: 0 0 auto;
  width: 19px;
  height: 19px;
  color: $color-primary;
}

.official-shipping-card__title {
  margin: 0;
  color: $color-primary;
  font-weight: 800;
  font-size: 0.9rem;
}

.official-shipping-card__value {
  margin: 0;
  color: $color-ink;
  font-size: 0.95rem;
  font-weight: 700;
}

.official-shipping-card__description {
  margin: 0;
  color: $color-muted;
  font-size: 0.85rem;
  line-height: 1.45;
}

.official-shipping-card--compact .official-shipping-card__description,
.official-shipping-card--compact {
  padding: 9px 12px;
}

.official-shipping-card--full {
  padding: 12px 14px;
}
</style>


