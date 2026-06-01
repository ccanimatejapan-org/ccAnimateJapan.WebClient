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
      <label>
        <span>{{ t('orderForm.basicInfo.bank') }}</span>
        <input
          v-model="store.form.subscriberBank"
          type="text"
          inputmode="numeric"
          maxlength="5"
          autocomplete="off"
        />
        <small v-if="store.fieldErrors.subscriberBank" class="form-error">
          {{ t(store.fieldErrors.subscriberBank) }}
        </small>
      </label>
      <label>
        <span>{{ t('orderForm.basicInfo.deliveryType') }}</span>
        <select v-model.number="store.form.deliveryTypeId">
          <option :value="null">{{ t('orderForm.basicInfo.deliveryTypePlaceholder') }}</option>
          <option
            v-for="deliveryType in store.deliveryTypes"
            :key="deliveryType.id"
            :value="deliveryType.id"
          >
            {{ deliveryType.name }}
          </option>
        </select>
        <small v-if="store.fieldErrors.deliveryTypeId" class="form-error">
          {{ t(store.fieldErrors.deliveryTypeId) }}
        </small>
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
