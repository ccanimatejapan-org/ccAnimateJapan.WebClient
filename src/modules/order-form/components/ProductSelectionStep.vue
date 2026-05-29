<template>
  <section class="order-form-card">
    <div v-if="store.products.length === 0" class="order-form-empty">
      {{ t('orderForm.noProducts') }}
    </div>

    <div v-else class="order-product-list">
      <article v-for="product in store.products" :key="product.id" class="order-product-row">
        <button
          v-if="product.imageUrl"
          type="button"
          class="order-product-image"
          :aria-label="t('orderForm.products.previewImage', { name: product.name })"
          @click="openImagePreview(product)"
        >
          <img :src="product.imageUrl" :alt="product.name" />
          <span class="order-product-image__zoom" aria-hidden="true">🔍</span>
        </button>
        <div v-else class="order-product-image order-product-image--empty" aria-hidden="true">
          <span>?</span>
        </div>

        <div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.info }}</p>
          <strong>{{ formatMoney(product.price) }}</strong>
        </div>
        <label>
          <span>{{ t('orderForm.products.quantity') }}</span>
          <input
            type="number"
            min="0"
            :max="getQuantityMax(store.activity, product)"
            :value="store.quantities[product.id]"
            @input="store.setQuantity(product.id, $event.target.value)"
          />
        </label>
      </article>
    </div>

    <p v-if="store.fieldErrors.products" class="form-error">
      {{ t(store.fieldErrors.products) }}
    </p>

    <div class="order-form-total">
      <span>{{ t('orderForm.products.totalQuantity') }}：{{ store.totalQuantity }}</span>
      <strong>{{ t('orderForm.products.total') }}：{{ formatMoney(store.total) }}</strong>
    </div>

    <div class="order-form-actions">
      <AppButton variant="ghost" @click="store.previousStep">
        {{ t('orderForm.actions.previous') }}
      </AppButton>
      <AppButton @click="store.nextStep">{{ t('orderForm.actions.next') }}</AppButton>
    </div>

    <Teleport to="body">
      <div
        v-if="previewImage"
        class="order-image-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="previewImage.name"
      >
        <button
          type="button"
          class="order-image-lightbox__backdrop"
          :aria-label="t('common.close')"
          @click="closeImagePreview"
        />
        <section class="order-image-lightbox__panel">
          <button
            type="button"
            class="order-image-lightbox__close"
            :aria-label="t('common.close')"
            @click="closeImagePreview"
          >
            ×
          </button>
          <img :src="previewImage.imageUrl" :alt="previewImage.name" />
          <p>{{ previewImage.name }}</p>
        </section>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { formatMoney } from '@/shared/utils/money';
import { useOrderFormStore } from '../stores/orderFormStore';
import { useProductImagePreview } from '../composables/useProductImagePreview';
import { getQuantityMax } from '../utils/quantityPolicy';

const { t } = useI18n();
const store = useOrderFormStore();
const { previewImage, openImagePreview, closeImagePreview } = useProductImagePreview();
</script>
