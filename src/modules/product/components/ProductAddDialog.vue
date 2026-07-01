<template>
  <AppModal
    :model-value="modelValue"
    :title="t('product.addDialog.title')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="product" class="product-add-dialog">
      <div class="product-add-dialog__product">
        <ProductImageCarousel
          class="product-add-dialog__gallery"
          :images="product.imageUrls"
          :alt="product.name"
        />
        <div class="product-add-dialog__heading">
          <p v-if="activity?.name">{{ activity.name }}</p>
          <h3>{{ product.name }}</h3>
          <AppPrice :value="product.price" />
        </div>
      </div>

      <div class="product-add-dialog__field">
        <span>{{ t('product.addDialog.quantity') }}</span>
        <div class="product-add-dialog__quantity">
          <button type="button" @click="setQuantity(quantity - 1)">-</button>
          <input
            v-model.number="quantity"
            type="number"
            min="1"
            :max="maxQuantity || undefined"
            inputmode="numeric"
            @blur="setQuantity(quantity)"
          />
          <button type="button" @click="setQuantity(quantity + 1)">+</button>
        </div>
        <p v-if="showMaxQuantityHint" class="product-add-dialog__hint">
          {{ t('product.addDialog.maxQuantityHint', { count: maxQuantity }) }}
        </p>
      </div>

      <label class="product-add-dialog__field">
        <span>{{ t('product.addDialog.note') }}</span>
        <textarea
          v-model="note"
          maxlength="80"
          rows="3"
          :placeholder="t('product.addDialog.notePlaceholder')"
        />
      </label>

      <div class="product-add-dialog__summary">
        <span>{{ t('product.addDialog.subtotal') }}</span>
        <AppPrice :value="product.price * quantity" />
      </div>

      <div class="product-add-dialog__actions">
        <AppButton variant="secondary" @click="$emit('update:modelValue', false)">
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton :disabled="isSoldOut" @click="confirm">
          {{ confirmButtonLabel }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import AppModal from '@/shared/components/AppModal.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import { MAX_ORDER_QUANTITY } from '@/shared/constants/quantity';
import ProductImageCarousel from './ProductImageCarousel.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  },
  activity: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'confirm']);
const { t } = useI18n();
const quantity = ref(1);
const note = ref('');

const MAX_QUANTITY = MAX_ORDER_QUANTITY;
const ACTIVITY_STATUS_ENDED = 4;

const isActivityEnded = computed(() => props.activity?.status === ACTIVITY_STATUS_ENDED);
const isSoldOut = computed(() => Boolean(props.product?.isOutStock || isActivityEnded.value));
const confirmButtonLabel = computed(() => {
  if (isActivityEnded.value) return t('product.activityEnded');
  return isSoldOut.value ? t('product.soldOut') : t('product.addDialog.confirm');
});

const maxQuantity = computed(() => {
  if (props.activity?.isPreOrder) return MAX_QUANTITY;
  const stock = Number(props.product?.stock);
  if (!Number.isFinite(stock)) return MAX_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(0, stock));
});

const showMaxQuantityHint = computed(
  () => maxQuantity.value > 0 && quantity.value >= maxQuantity.value
);

watch(
  () => [props.modelValue, props.product?.id],
  () => {
    if (!props.modelValue) return;
    quantity.value = 1;
    note.value = '';
  }
);

function setQuantity(value) {
  const nextValue = Math.max(1, Math.floor(Number(value) || 1));
  const cap = maxQuantity.value;
  quantity.value = cap > 0 ? Math.min(cap, nextValue) : nextValue;
}

function confirm() {
  if (isSoldOut.value) return;
  setQuantity(quantity.value);
  if (!props.product?.id) {
    emit('update:modelValue', false);
    return;
  }
  emit('confirm', {
    quantity: quantity.value,
    note: note.value.trim()
  });
}
</script>

<style scoped lang="scss">
@use '../styles/product-add-dialog';
</style>
