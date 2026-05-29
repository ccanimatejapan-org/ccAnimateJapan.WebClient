<template>
  <section class="order-form-card">
    <div class="form-grid">
      <label>
        <span>{{ t('orderForm.basicInfo.name') }}</span>
        <input v-model="store.form.subscriberName" type="text" />
        <small v-if="store.fieldErrors.subscriberName" class="form-error">
          {{ t(store.fieldErrors.subscriberName) }}
        </small>
      </label>
      <label>
        <span>{{ t('orderForm.basicInfo.email') }}</span>
        <input v-model="store.form.subscriberEmail" type="email" />
        <small v-if="store.fieldErrors.subscriberEmail" class="form-error">
          {{ t(store.fieldErrors.subscriberEmail) }}
        </small>
      </label>
      <label class="form-grid__full">
        <span>{{ t('orderForm.basicInfo.phone') }}</span>
        <input v-model="store.form.subscriberPhone" type="tel" />
      </label>
    </div>
    <div class="order-form-actions">
      <AppButton variant="ghost" @click="store.previousStep">
        {{ t('orderForm.actions.previous') }}
      </AppButton>
      <AppButton @click="store.nextStep">{{ t('orderForm.actions.next') }}</AppButton>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { useOrderFormStore } from '../stores/orderFormStore';

const { t } = useI18n();
const store = useOrderFormStore();
</script>
