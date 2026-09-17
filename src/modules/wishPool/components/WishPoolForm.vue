<template>
  <form class="form-grid wish-pool-form" novalidate @submit.prevent="onSubmit">
    <div class="wish-pool-form__field form-grid__full">
      <label :id="animateTypeLabelId" :for="animateTypeSelectId">{{ t('wishPool.form.animateType') }}</label>
      <CustomSelect
        :id="animateTypeSelectId"
        v-model="draft.animateTypeId"
        :options="animateTypeOptions"
        :selected-label="selectedAnimateTypeName"
        :label-id="animateTypeLabelId"
        :placeholder="t('wishPool.form.animateTypePlaceholder')"
        :disabled="isAnimateTypeControlDisabled"
        :invalid="Boolean(animateTypeError)"
        :description-id="animateTypeStateId"
      >
        <template #default="{ setValue, isOptionSelected }">
          <button
            v-for="type in animateTypeOptions"
            :key="type.value"
            type="button"
            class="wish-pool-form__option"
            role="option"
            :data-value="String(type.value)"
            :aria-selected="isOptionSelected(type.value)"
            @click="() => setValue(type.value)"
          >
            {{ type.label }}
          </button>
        </template>
      </CustomSelect>

      <small v-if="animateTypesLoading" :id="animateTypeStateId" class="form-grid__hint">{{ t('common.loading') }}</small>
      <small v-else-if="animateTypesLoadFailed" :id="animateTypeStateId" class="form-grid__error">
        {{ t('wishPool.form.animateTypesLoadFailed') }}
        <button type="button" class="wish-pool-form__retry" @click="$emit('retry-animate-types')">
          {{ t('common.retry') }}
        </button>
      </small>
      <small v-else-if="animateTypeError" :id="animateTypeStateId" class="form-grid__error">{{ animateTypeError }}</small>
    </div>

    <div class="wish-pool-form__field form-grid__full">
      <label :for="activityNameInputId">{{ t('wishPool.form.activityName') }}</label>
      <input
        :id="activityNameInputId"
        v-model="draft.activityName"
        :disabled="saving"
        :maxlength="MAX_ACTIVITY_NAME_LENGTH"
        :placeholder="t('wishPool.form.activityNamePlaceholder')"
        :aria-invalid="Boolean(activityNameError)"
      />
      <small v-if="activityNameError" class="form-grid__error">{{ activityNameError }}</small>
    </div>

    <div class="wish-pool-form__field form-grid__full">
      <label :for="productUrlInputId">{{ t('wishPool.form.productUrl') }}</label>
      <input
        :id="productUrlInputId"
        v-model="draft.productUrl"
        type="url"
        :disabled="saving"
        :maxlength="MAX_PRODUCT_URL_LENGTH"
        :placeholder="t('wishPool.form.productUrlPlaceholder')"
        :aria-invalid="Boolean(productUrlError)"
      />
      <small v-if="productUrlError" class="form-grid__error">{{ productUrlError }}</small>
      <small v-else class="form-grid__hint">{{ t('wishPool.form.productUrlHint') }}</small>
    </div>

    <div class="wish-pool-form__field wish-pool-form__image-area form-grid__full">
      <label :for="`${imagePickerId}-picker`">{{ t('wishPool.form.image') }}</label>
      <WishPoolImagePicker
        ref="imagePicker"
        :id="imagePickerId"
        :preview-url="imagePreview"
        :preview-alt="t('wishPool.form.imagePreview')"
        :disabled="saving"
        :invalid="Boolean(imageError)"
        :description-id="imageStateId"
        :picker-label="t('wishPool.form.image')"
        :show-clear="Boolean(draft.imageFile)"
        @file-change="onFileChange"
        @clear="clearImage"
      />

      <small v-if="imageError" :id="imageStateId" class="form-grid__error">{{ imageError }}</small>
      <small v-else class="form-grid__hint">{{ t('wishPool.form.imageHint') }}</small>
    </div>

    <div class="wish-pool-form__actions form-grid__full">
      <AppButton type="button" variant="secondary" :disabled="saving" @click="onCancel">
        {{ t('common.cancel') }}
      </AppButton>
      <AppButton type="submit" :disabled="submitDisabled">
        {{ saving ? t('wishPool.form.submitting') : t('wishPool.form.submit') }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import CustomSelect from '@/shared/components/CustomSelect.vue';
import WishPoolImagePicker from './WishPoolImagePicker.vue';
import {
  MAX_ACTIVITY_NAME_LENGTH,
  MAX_PRODUCT_URL_LENGTH,
  validateImageFile,
  validateWishPoolDraft
} from '../utils/wishPoolRules';

const props = defineProps({
  animateTypes: {
    type: Array,
    default: () => []
  },
  animateTypesLoading: {
    type: Boolean,
    default: false
  },
  animateTypesLoadFailed: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: [Number, String],
    default: 0
  }
});

const emit = defineEmits(['submit', 'cancel', 'retry-animate-types']);
const { t } = useI18n();

const formId = `wish-pool-form-${Math.random().toString(36).slice(2)}`;
const imagePicker = ref(null);
const imagePreview = ref('');
const imageErrorKey = ref('');
const showErrors = ref(false);

const draft = reactive({
  animateTypeId: '',
  activityName: '',
  productUrl: '',
  imageFile: null
});

const errors = computed(() => validateWishPoolDraft(draft));
const imagePickerId = `${formId}-image`;
const imageStateId = `${formId}-image-state`;
const animateTypeLabelId = `${formId}-animate-type-label`;
const animateTypeStateId = `${formId}-animate-type-state`;
const animateTypeSelectId = `${formId}-animate-type-select`;
const activityNameInputId = `${formId}-activity-name`;
const productUrlInputId = `${formId}-product-url`;

const animateTypeOptions = computed(() =>
  props.animateTypes.map((type) => ({
    value: type.id,
    label: type.name
  }))
);

const selectedAnimateTypeName = computed(() => {
  const found = props.animateTypes.find((type) => String(type.id) === String(draft.animateTypeId));
  return found?.name ?? '';
});

const isAnimateTypeControlDisabled = computed(() => {
  return props.saving || props.animateTypesLoading || props.animateTypesLoadFailed;
});

const animateTypeError = computed(() => {
  if (!showErrors.value || !errors.value.animateTypeId) return '';
  return t(errors.value.animateTypeId);
});

const activityNameError = computed(() => {
  if (!showErrors.value || !errors.value.activityName) return '';
  return t(errors.value.activityName);
});

const productUrlError = computed(() => {
  if (!showErrors.value || !errors.value.productUrl) return '';
  return t(errors.value.productUrl);
});

const imageError = computed(() => {
  if (imageErrorKey.value) return t(imageErrorKey.value);
  if (!showErrors.value || !errors.value.imageFile) return '';
  return t(errors.value.imageFile);
});

const submitDisabled = computed(() => {
  return (
    props.saving ||
    props.animateTypesLoading ||
    props.animateTypesLoadFailed ||
    !props.animateTypes.length
  );
});

function setPreview(file) {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value);
  draft.imageFile = file;
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  } else {
    imagePreview.value = '';
  }
}

function revokeImagePreview() {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value);
  imagePreview.value = '';
}

function clearImage() {
  revokeImagePreview();
  draft.imageFile = null;
  imageErrorKey.value = '';
  imagePicker.value?.clearInput();
}

function onFileChange(file) {
  if (!file) {
    clearImage();
    return;
  }

  const validation = validateImageFile(file);
  imageErrorKey.value = validation.error || '';

  if (!validation.valid) {
    setPreview(null);
    return;
  }

  setPreview(file);
}

function resetForm() {
  draft.animateTypeId = '';
  draft.activityName = '';
  draft.productUrl = '';
  clearImage();
  showErrors.value = false;
}

function onCancel() {
  if (props.saving) return;

  resetForm();
  emit('cancel');
}

function onSubmit() {
  if (submitDisabled.value) return;

  showErrors.value = true;
  if (Object.keys(errors.value).length) return;

  emit('submit', {
    animateTypeId: draft.animateTypeId,
    activityName: draft.activityName.trim(),
    productUrl: draft.productUrl.trim(),
    imageFile: draft.imageFile
  });
}

watch(
  () => props.resetToken,
  resetForm
);

watch(
  () => props.animateTypes,
  () => {
    const hasSelection = props.animateTypes.find((type) => String(type.id) === String(draft.animateTypeId));
    if (!hasSelection) {
      draft.animateTypeId = '';
    }
  }
);

onBeforeUnmount(() => {
  revokeImagePreview();
  imagePicker.value?.clearInput();
});
</script>

<style scoped lang="scss">
@use '../styles/wish-pool-form';
</style>
