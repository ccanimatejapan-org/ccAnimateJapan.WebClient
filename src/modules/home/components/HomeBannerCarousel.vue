<template>
  <section v-if="banners.length" class="home-banner" aria-label="主視覺">
    <div class="home-banner__viewport">
      <div class="home-banner__track" :style="{ transform: `translateX(-${current * 100}%)` }">
        <component
          :is="isExternal(banner.to) ? 'a' : RouterLink"
          v-for="(banner, index) in banners"
          :key="index"
          class="home-banner__slide"
          v-bind="slideProps(banner)"
        >
          <img :src="banner.image" :alt="banner.alt" />
        </component>
      </div>
    </div>

    <div v-if="banners.length > 1" class="home-banner__dots">
      <button
        v-for="(banner, index) in banners"
        :key="index"
        type="button"
        class="home-banner__dot"
        :class="{ 'home-banner__dot--active': index === current }"
        :aria-label="`第 ${index + 1} 張`"
        @click="go(index)"
      />
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { homeBanners } from '../config/homeBanners';

const banners = homeBanners;
const current = ref(0);
let timer;

function isExternal(to) {
  return typeof to === 'string';
}

function slideProps(banner) {
  if (isExternal(banner.to)) {
    return { href: banner.to, target: '_blank', rel: 'noopener' };
  }
  return { to: banner.to };
}

function go(index) {
  current.value = index;
}

function next() {
  current.value = (current.value + 1) % banners.length;
}

onMounted(() => {
  if (banners.length > 1) {
    timer = window.setInterval(next, 5000);
  }
});

onBeforeUnmount(() => {
  window.clearInterval(timer);
});
</script>

<style scoped lang="scss">
@use '../styles/home-banner';
</style>
