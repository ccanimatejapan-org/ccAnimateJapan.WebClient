<template>
  <section v-if="banners.length" class="home-banner" :aria-label="t('home.bannerAriaLabel')">
    <div class="home-banner__viewport">
      <div class="home-banner__track" :style="{ transform: `translateX(-${current * 100}%)` }">
        <div
          v-for="(banner, index) in banners"
          :key="index"
          class="home-banner__slide"
        >
          <img :src="banner.image" :alt="banner.alt" />
        </div>
      </div>
      <button
        v-if="banners.length > 1"
        type="button"
        class="home-banner__arrow home-banner__arrow--prev"
        :aria-label="t('home.bannerPrev')"
        @click="prev"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        v-if="banners.length > 1"
        type="button"
        class="home-banner__arrow home-banner__arrow--next"
        :aria-label="t('home.bannerNext')"
        @click="next"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>

    <div v-if="banners.length > 1" class="home-banner__dots">
      <button
        v-for="(banner, index) in banners"
        :key="index"
        type="button"
        class="home-banner__dot"
        :class="{ 'home-banner__dot--active': index === current }"
        :aria-label="t('home.bannerSlideAriaLabel', { num: index + 1 })"
        @click="go(index)"
      />
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { homeBanners } from '../config/homeBanners';

const { t } = useI18n();
const banners = homeBanners;
const current = ref(0);
let timer;

function go(index) {
  current.value = index;
  startTimer();
}

function next() {
  current.value = (current.value + 1) % banners.length;
  startTimer();
}

function prev() {
  current.value = (current.value - 1 + banners.length) % banners.length;
  startTimer();
}

function startTimer() {
  window.clearInterval(timer);
  if (banners.length > 1) {
    timer = window.setInterval(next, 5000);
  }
}

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  window.clearInterval(timer);
});
</script>

<style scoped lang="scss">
@use '../styles/home-banner';
</style>
