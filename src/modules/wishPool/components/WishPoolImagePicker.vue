<template>
  <div class="wish-pool-image-picker" :class="{ 'wish-pool-image-picker--disabled': disabled, 'wish-pool-image-picker--error': invalid }">
    <input
      :id="inputId"
      ref="fileInput"
      type="file"
      class="wish-pool-image-picker__input"
      :accept="accept"
      :aria-label="pickerLabel"
      :aria-invalid="Boolean(invalid)"
      :aria-describedby="descriptionId"
      :disabled="disabled"
      @change="onInputChange"
    />

    <div class="wish-pool-image-picker__tiles">
      <button
        :id="pickerButtonId"
        type="button"
        class="wish-pool-image-picker__tile wish-pool-image-picker__picker"
        :aria-label="pickerLabel"
        :disabled="disabled"
        @click="openPicker"
      >
        <span class="wish-pool-image-picker__plus" aria-hidden="true">＋</span>
        <span class="wish-pool-image-picker__picker-label">{{ t('wishPool.form.image') }}</span>
      </button>

      <figure class="wish-pool-image-picker__tile wish-pool-image-picker__preview" :aria-label="previewAlt" role="group">
        <img
          v-if="previewUrl"
          class="wish-pool-image-picker__image"
          :src="previewUrl"
          :alt="previewAlt"
        />
        <figcaption v-else class="wish-pool-image-picker__empty" aria-hidden="true">
          {{ t('wishPool.form.imageHint') }}
        </figcaption>
      </figure>
    </div>

    <button
      v-if="showClear"
      type="button"
      class="wish-pool-image-picker__clear"
      :disabled="disabled"
      @click="clearInput"
    >
      {{ t('common.remove') }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  previewUrl: {
    type: String,
    default: ''
  },
  previewAlt: {
    type: String,
    default: ''
  },
  pickerLabel: {
    type: String,
    default: ''
  },
  showClear: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  },
  descriptionId: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif'
  }
});

const { t } = useI18n();
const emit = defineEmits(['file-change', 'clear']);

const pickerId = props.id || `wish-pool-image-picker-${Math.random().toString(36).slice(2)}`;
const inputId = `${pickerId}-input`;
const pickerButtonId = `${pickerId}-picker`;
const fileInput = ref(null);

function openPicker() {
  if (props.disabled) return;
  fileInput.value?.click();
}

function onInputChange(event) {
  const file = event.target.files?.[0] || null;
  emit('file-change', file);
}

function clearInput() {
  if (fileInput.value) {
    fileInput.value.value = '';
  }

  emit('clear');
}

defineExpose({
  clearInput,
  pickerButtonId
});
</script>

<style scoped lang="scss">
@use '../styles/wish-pool-image-picker';
</style>
