<template>
  <section class="app-empty">
    <div class="app-empty__icon" aria-hidden="true">
      <svg class="ui-icon" viewBox="0 0 24 24">
        <path :d="iconPath" />
      </svg>
    </div>
    <p class="app-empty__message">{{ message }}</p>
    <slot />
  </section>
</template>

<script setup>
import { computed } from 'vue';

const ICONS = {
  bag: 'M5 7h14l1 14H4L5 7ZM9 8V6a3 3 0 0 1 6 0v2',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  box: 'm3 7 9-4 9 4v11l-9 4-9-4ZM3 7l9 4 9-4M12 11v11',
  spark: 'm12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z',
  info: 'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0'
};

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'box'
  }
});

const iconPath = computed(() => ICONS[props.icon] || ICONS.box);
</script>
