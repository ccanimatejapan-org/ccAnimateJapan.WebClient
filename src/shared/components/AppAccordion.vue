<template>
  <section class="accordion" :class="{ 'accordion--open': open }">
    <h2 class="accordion__heading">
      <button
        type="button"
        class="accordion__trigger"
        :aria-expanded="open"
        :aria-controls="panelId"
        @click="open = !open"
      >
        <span class="accordion__title">{{ title }}</span>
        <span class="accordion__chevron" aria-hidden="true"></span>
      </button>
    </h2>
    <Transition name="accordion-collapse">
      <div v-show="open" :id="panelId" class="accordion__panel" role="region">
        <slot />
      </div>
    </Transition>
  </section>
</template>

<script>
let seq = 0;
</script>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  defaultOpen: { type: Boolean, default: false }
});

const open = ref(props.defaultOpen);
const panelId = `accordion-panel-${(seq += 1)}`;
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.accordion {
  border: 1px solid $color-border;
  border-radius: 12px;
  background: #fff;
}

.accordion__heading {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 14px 16px;
  border: 0;
  background: none;
  color: $color-ink;
  font: inherit;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
}

.accordion__trigger:hover .accordion__title {
  color: $color-primary;
}

.accordion__trigger:focus-visible {
  outline: 2px solid rgba($color-primary, 0.5);
  outline-offset: -2px;
  border-radius: 12px;
}

.accordion__title {
  min-width: 0;
}

.accordion__chevron {
  flex: 0 0 auto;
  width: 9px;
  height: 9px;
  margin-right: 3px;
  border-right: 2px solid $color-primary;
  border-bottom: 2px solid $color-primary;
  transform: rotate(-45deg);
  transition: transform 0.2s ease;
}

.accordion__trigger[aria-expanded='true'] .accordion__chevron {
  transform: rotate(45deg);
}

.accordion__panel {
  display: grid;
  gap: 10px;
  padding: 2px 16px 16px;
}

.accordion-collapse-enter-active,
.accordion-collapse-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.accordion-collapse-enter-from,
.accordion-collapse-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
