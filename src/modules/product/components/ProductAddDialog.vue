<template>
  <AppModal
    :model-value="modelValue"
    :title="t('product.addDialog.title')"
    fit-content
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
          {{ t('product.addDialog.maxOrderQuantityHint', { count: MAX_QUANTITY }) }}
        </p>
        <p v-if="showStockQuantityHint" class="product-add-dialog__hint">
          {{ t('product.addDialog.stockQuantityHint', { count: stockQuantity }) }}
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
        <AppButton :disabled="isSoldOut || isAdding" @click="confirm">
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
import { isActivityOrderable } from '@/shared/utils/activityOrderable.js';
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
  },
  cartQuantity: {
    type: Number,
    default: 0
  },
  isAdding: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'confirm']);
const { t } = useI18n();
const quantity = ref(1);
const note = ref('');

const MAX_QUANTITY = MAX_ORDER_QUANTITY;
const isActivityAvailable = computed(() => isActivityOrderable(props.activity));
const orderRemaining = computed(() => Math.max(0, MAX_QUANTITY - props.cartQuantity));

const isSoldOut = computed(() => Boolean(
  props.product?.isOutStock
  || !isActivityAvailable.value
  || orderRemaining.value <= 0
  || (!props.activity?.isPreOrder && stockRemaining.value !== null && stockRemaining.value <= 0)
));
const confirmButtonLabel = computed(() => {
  if (!isActivityAvailable.value) return t('product.activityUnavailable');
  if (orderRemaining.value <= 0) return t('product.addDialog.limitReached');
  if (!props.activity?.isPreOrder && stockRemaining.value !== null && stockRemaining.value <= 0) {
    return t('product.soldOut');
  }
  if (props.product?.isOutStock) return t('product.soldOut');
  return t('product.addDialog.confirm');
});

const stockQuantity = computed(() => {
  const stock = Number(props.product?.stock);
  return Number.isFinite(stock) ? Math.max(0, stock) : null;
});
const stockRemaining = computed(() => (
  stockQuantity.value === null
    ? null
    : Math.max(0, stockQuantity.value - props.cartQuantity)
));
const maxQuantity = computed(() => {
  if (props.activity?.isPreOrder || stockQuantity.value === null) return orderRemaining.value;
  return Math.min(orderRemaining.value, stockRemaining.value);
});

const showMaxQuantityHint = computed(
  () => orderRemaining.value > 0 && quantity.value >= maxQuantity.value
);
const showStockQuantityHint = computed(
  () => !props.activity?.isPreOrder && stockQuantity.value !== null && stockQuantity.value < MAX_QUANTITY
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
  quantity.value = cap > 0 ? Math.min(cap, nextValue) : 1;
}

function confirm() {
  if (isSoldOut.value || props.isAdding) return;
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
