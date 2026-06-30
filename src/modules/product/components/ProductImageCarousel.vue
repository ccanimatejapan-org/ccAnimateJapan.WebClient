<template>
  <div class="product-image-carousel">
    <div class="product-image-carousel__viewport">
      <div
        v-if="slides.length"
        ref="track"
        class="product-image-carousel__track"
        @scroll="onScroll"
      >
        <div
          v-for="(src, index) in slides"
          :key="index"
          class="product-image-carousel__slide"
        >
          <img :src="src" :alt="alt" loading="lazy" />
        </div>
      </div>
      <div v-else class="product-image-carousel__placeholder" aria-hidden="true"></div>

      <button
        v-if="slides.length"
        type="button"
        class="product-image-carousel__zoom"
        :aria-label="t('product.gallery.zoom')"
        @click.stop="openLightbox"
      >
        <svg class="product-image-carousel__zoom-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.2-4.2M11 8v6M8 11h6" />
        </svg>
      </button>

      <button
        v-if="slides.length > 1"
        v-show="activeIndex > 0"
        type="button"
        class="product-image-carousel__nav product-image-carousel__nav--prev"
        :aria-label="t('product.gallery.prev')"
        @click.stop="goPrev"
      >
        <svg class="product-image-carousel__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <button
        v-if="slides.length > 1"
        v-show="activeIndex < slides.length - 1"
        type="button"
        class="product-image-carousel__nav product-image-carousel__nav--next"
        :aria-label="t('product.gallery.next')"
        @click.stop="goNext"
      >
        <svg class="product-image-carousel__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>

    <div v-if="slides.length > 1" class="product-image-carousel__dots">
      <button
        v-for="(src, index) in slides"
        :key="index"
        type="button"
        class="product-image-carousel__dot"
        :class="{ 'is-active': index === activeIndex }"
        :aria-label="t('product.gallery.goToImage', { index: index + 1 })"
        :aria-current="index === activeIndex ? 'true' : undefined"
        @click.stop="scrollTo(index)"
      />
    </div>

    <ProductImageLightbox
      :open="isLightboxOpen"
      :images="slides"
      :alt="alt"
      :initial-index="activeIndex"
      @close="isLightboxOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ProductImageLightbox from './ProductImageLightbox.vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  alt: {
    type: String,
    default: ''
  }
});

const { t } = useI18n();
const track = ref(null);
const activeIndex = ref(0);
const isLightboxOpen = ref(false);

function openLightbox() {
  isLightboxOpen.value = true;
}

const slides = computed(() =>
  (Array.isArray(props.images) ? props.images : []).filter(
    (src) => typeof src === 'string' && src.trim()
  )
);

function onScroll() {
  const el = track.value;
  if (!el) return;
  const width = el.clientWidth || 1;
  const index = Math.round(el.scrollLeft / width);
  activeIndex.value = Math.min(slides.value.length - 1, Math.max(0, index));
}

function scrollTo(index) {
  const el = track.value;
  if (!el) return;
  const clamped = Math.min(slides.value.length - 1, Math.max(0, index));
  el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
}

function goPrev() {
  scrollTo(activeIndex.value - 1);
}

function goNext() {
  scrollTo(activeIndex.value + 1);
}

watch(slides, () => {
  activeIndex.value = 0;
  if (track.value) track.value.scrollLeft = 0;
});
</script>

<style scoped lang="scss">
@use '../styles/product-image-carousel';
</style>
