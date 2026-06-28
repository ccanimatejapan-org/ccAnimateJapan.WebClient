<template>
  <article class="info-page">
    <header class="info-page__head">
      <h1 class="info-page__title">{{ t(`${contentKey}.title`) }}</h1>
      <p v-if="updated" class="info-page__updated">
        {{ t('info.common.updatedLabel') }} · {{ updated }}
      </p>
    </header>

    <p v-if="hasIntro" class="info-page__intro">{{ t(`${contentKey}.intro`) }}</p>

    <section
      v-for="(section, index) in sections"
      :key="index"
      class="info-page__section"
    >
      <h2 v-if="section.heading" :id="headingId(index)" class="info-page__heading">
        <button
          type="button"
          class="info-page__trigger"
          :aria-expanded="isExpanded(index)"
          :aria-controls="panelId(index)"
          @click="toggle(index)"
        >
          <span class="info-page__heading-text">{{ rt(section.heading) }}</span>
          <span class="info-page__chevron" aria-hidden="true"></span>
        </button>
      </h2>
      <Transition name="info-collapse">
        <ul
          v-show="isExpanded(index)"
          :id="panelId(index)"
          class="info-page__list"
          role="region"
          :aria-labelledby="headingId(index)"
        >
          <li v-for="(item, itemIndex) in section.items" :key="itemIndex">{{ rt(item) }}</li>
        </ul>
      </Transition>
    </section>

  </article>

  <Teleport to="#site-page-foot">
    <div class="info-page__back-bar">
      <RouterLink class="info-page__back" :to="{ name: ROUTE_NAMES.HOME }">
        <svg
          class="info-page__back-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 10.7 12 4l9 6.7" />
          <path d="M5.5 9.5V20h13V9.5" />
          <path d="M9.7 20v-5.2h4.6V20" />
        </svg>
        {{ t('info.common.backHome') }}
      </RouterLink>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const props = defineProps({
  contentKey: { type: String, required: true },
  updated: { type: String, default: '' }
});

const { t, tm, rt, te } = useI18n();

const DESKTOP_QUERY = '(min-width: 760px)';
const isDesktop = ref(
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
);
const openIndexes = reactive(new Set([0]));

let mediaQuery;
function syncDesktop(event) {
  isDesktop.value = event.matches;
}

onMounted(() => {
  mediaQuery = window.matchMedia(DESKTOP_QUERY);
  isDesktop.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', syncDesktop);
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', syncDesktop);
});

const sections = computed(() => {
  const value = tm(`${props.contentKey}.sections`);
  return Array.isArray(value) ? value : [];
});

const hasIntro = computed(() => te(`${props.contentKey}.intro`));

const baseId = computed(() => `info-${props.contentKey.replace(/\W+/g, '-')}`);

function headingId(index) {
  return `${baseId.value}-h-${index}`;
}

function panelId(index) {
  return `${baseId.value}-p-${index}`;
}

function isExpanded(index) {
  return isDesktop.value || openIndexes.has(index);
}

function toggle(index) {
  if (isDesktop.value) return;
  if (openIndexes.has(index)) {
    openIndexes.delete(index);
  } else {
    openIndexes.add(index);
  }
}
</script>

<style scoped lang="scss">
@use '../styles/info-page';
</style>
