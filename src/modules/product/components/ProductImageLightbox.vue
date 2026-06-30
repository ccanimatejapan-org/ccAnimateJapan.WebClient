<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="product-lightbox"
      role="dialog"
      aria-modal="true"
      @click.self="close"
    >
      <button
        type="button"
        class="product-lightbox__close"
        :aria-label="t('product.gallery.close')"
        @click="close"
      >
        <svg class="product-lightbox__close-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <button
        v-if="images.length > 1"
        v-show="activeIndex > 0"
        type="button"
        class="product-lightbox__nav product-lightbox__nav--prev"
        :aria-label="t('product.gallery.prev')"
        @click="goTo(activeIndex - 1)"
      >
        <svg class="product-lightbox__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <button
        v-if="images.length > 1"
        v-show="activeIndex < images.length - 1"
        type="button"
        class="product-lightbox__nav product-lightbox__nav--next"
        :aria-label="t('product.gallery.next')"
        @click="goTo(activeIndex + 1)"
      >
        <svg class="product-lightbox__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div ref="track" class="product-lightbox__track" @scroll="onScroll">
        <div
          v-for="(src, index) in images"
          :key="index"
          class="product-lightbox__slide"
          @click.self="close"
        >
          <img :src="src" :alt="alt" />
        </div>
      </div>

      <div v-if="images.length > 1" class="product-lightbox__counter">
        {{ activeIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  images: {
    type: Array,
    default: () => []
  },
  alt: {
    type: String,
    default: ''
  },
  initialIndex: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close']);
const { t } = useI18n();
const track = ref(null);
const activeIndex = ref(0);

function close() {
  emit('close');
}

function onScroll() {
  const el = track.value;
  if (!el) return;
  const width = el.clientWidth || 1;
  const index = Math.round(el.scrollLeft / width);
  activeIndex.value = Math.min(props.images.length - 1, Math.max(0, index));
}

function goTo(index) {
  const el = track.value;
  if (!el) return;
  const clamped = Math.min(props.images.length - 1, Math.max(0, index));
  el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
}

function onKeydown(event) {
  if (event.key === 'Escape') close();
  else if (event.key === 'ArrowLeft') goTo(activeIndex.value - 1);
  else if (event.key === 'ArrowRight') goTo(activeIndex.value + 1);
}

let previousOverflow = '';
function lockBodyScroll(locked) {
  if (typeof document === 'undefined') return;
  if (locked) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = previousOverflow;
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      lockBodyScroll(true);
      window.addEventListener('keydown', onKeydown);
      activeIndex.value = props.initialIndex;
      await nextTick();
      const el = track.value;
      if (el) el.scrollLeft = props.initialIndex * el.clientWidth;
    } else {
      window.removeEventListener('keydown', onKeydown);
      lockBodyScroll(false);
    }
  }
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  if (props.open) lockBodyScroll(false);
});
</script>

<style scoped lang="scss">
@use '../styles/product-image-lightbox';
</style>
