<template>
  <AppModal
    :model-value="modelValue"
    :title="t('product.addDialog.title')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="product" class="product-add-dialog">
      <div class="product-add-dialog__product">
        <img :src="product.imageUrl" :alt="product.name" />
        <div>
          <p v-if="activity?.name">{{ activity.name }}</p>
          <h3>{{ product.name }}</h3>
          <AppPrice :value="product.price" />
        </div>
      </div>

      <label class="product-add-dialog__field">
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
      </label>

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
        <AppButton @click="confirm">
          {{ t('product.addDialog.confirm') }}
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

const maxQuantity = computed(() => {
  const stock = Number(props.product?.stock);
  if (!Number.isFinite(stock) || stock <= 0) return null;
  return stock;
});

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
  quantity.value = maxQuantity.value ? Math.min(maxQuantity.value, nextValue) : nextValue;
}

function confirm() {
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
