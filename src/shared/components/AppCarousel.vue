<template>
  <div class="app-carousel">
    <button
      v-show="canScrollLeft"
      type="button"
      class="app-carousel__arrow app-carousel__arrow--prev"
      :aria-label="t('common.scrollPrev')"
      @click="scrollByStep(-1)"
    >
      <svg class="app-carousel__arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </button>

    <div ref="track" class="app-carousel__track" :style="trackStyle" @scroll="updateArrows">
      <slot />
    </div>

    <button
      v-show="canScrollRight"
      type="button"
      class="app-carousel__arrow app-carousel__arrow--next"
      :aria-label="t('common.scrollNext')"
      @click="scrollByStep(1)"
    >
      <svg class="app-carousel__arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  // 項目之間的間距（px），對齊各區原本的 gap
  gap: {
    type: Number,
    default: 12
  }
});

const { t } = useI18n();

const track = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const trackStyle = computed(() => ({ gap: `${props.gap}px` }));

function updateArrows() {
  const el = track.value;
  if (!el) return;

  const max = Math.max(0, el.scrollWidth - el.clientWidth);
  canScrollLeft.value = el.scrollLeft > 1;
  canScrollRight.value = max > 1 && el.scrollLeft < max - 1;
}

function scrollByStep(direction) {
  const el = track.value;
  if (!el) return;

  // 每次捲動約一個可視寬度的 80%
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
}

let resizeObserver = null;
let mutationObserver = null;
let arrowFrame = 0;

function queueUpdateArrows() {
  window.cancelAnimationFrame(arrowFrame);
  arrowFrame = window.requestAnimationFrame(() => {
    arrowFrame = 0;
    updateArrows();
  });
}

function observeTrackItems() {
  const el = track.value;
  if (!el || !resizeObserver) return;

  resizeObserver.disconnect();
  resizeObserver.observe(el);
  Array.from(el.children).forEach((child) => resizeObserver.observe(child));
}

onMounted(() => {
  queueUpdateArrows();

  if (typeof ResizeObserver !== 'undefined' && track.value) {
    resizeObserver = new ResizeObserver(queueUpdateArrows);
    observeTrackItems();
  }

  if (typeof MutationObserver !== 'undefined' && track.value) {
    mutationObserver = new MutationObserver(() => {
      observeTrackItems();
      queueUpdateArrows();
    });
    mutationObserver.observe(track.value, { childList: true, subtree: true });
  }

  window.addEventListener('resize', queueUpdateArrows);
});

onBeforeUnmount(() => {
  window.cancelAnimationFrame(arrowFrame);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  window.removeEventListener('resize', queueUpdateArrows);
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-carousel {
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.app-carousel__track {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;

  // 隱藏原生捲軸（改用左右箭頭操作）
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.app-carousel__arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid $color-border;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  color: $color-ink;
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(120, 100, 30, 0.14);
  transform: translateY(-50%);
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.app-carousel__arrow-icon {
  width: 18px;
  height: 18px;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.5;
}

.app-carousel__arrow:hover {
  background: $color-primary;
  color: #fff;
  box-shadow: 0 6px 14px rgba(120, 100, 30, 0.2);
}

.app-carousel__arrow:focus-visible {
  background: $color-primary;
  color: #fff;
  outline: 2px solid rgba(184, 121, 22, 0.32);
  outline-offset: 2px;
}

.app-carousel__arrow--prev {
  left: 8px;
}

.app-carousel__arrow--next {
  right: 8px;
}
</style>
