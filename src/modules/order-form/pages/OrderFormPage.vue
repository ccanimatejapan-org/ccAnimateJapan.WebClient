<template>
  <main class="order-form-shell">
    <section class="order-form-container">
      <AppLoading v-if="store.isLoading" :label="t('orderForm.loading')" />

      <div v-else-if="store.loadError" class="order-form-card">
        <p class="form-error">{{ t('orderForm.loadFailed') }}</p>
        <p>{{ t(store.loadError.message) }}</p>
      </div>

      <template v-else-if="store.activity">
        <header class="order-form-header">
          <p class="eyebrow">{{ t('orderForm.eyebrow') }}</p>
          <h1>{{ store.activity.name }}</h1>
          <div
            v-if="store.activity?.info"
            class="order-form-header__info"
            v-html="activityInfoHtml"
          />
        </header>

        <img
          v-if="store.activity.imageUrl"
          class="order-form-hero"
          :src="store.activity.imageUrl"
          :alt="store.activity.name"
        />

        <OrderFormSteps :current-step="store.currentStep" @select="store.goToStep" />

        <AgreementStep v-if="store.currentStep === 1" :agreement="store.agreement" />
        <BasicInfoStep v-else-if="store.currentStep === 2" />
        <ProductSelectionStep v-else-if="store.currentStep === 3" />
        <OrderPreviewStep v-else />
      </template>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppLoading from '@/shared/components/AppLoading.vue';
import { useOrderFormStore } from '../stores/orderFormStore';
import OrderFormSteps from '../components/OrderFormSteps.vue';
import AgreementStep from '../components/AgreementStep.vue';
import BasicInfoStep from '../components/BasicInfoStep.vue';
import ProductSelectionStep from '../components/ProductSelectionStep.vue';
import OrderPreviewStep from '../components/OrderPreviewStep.vue';
import { formatActivityInfoHtml } from '../utils/activityInfoHtml';
import '../styles/order-form.scss';

const props = defineProps({
  activityId: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();
const store = useOrderFormStore();
const activityInfoHtml = computed(() => formatActivityInfoHtml(store.activity?.info));

onMounted(() => store.initialize(props.activityId));

watch(
  () => props.activityId,
  (nextActivityId) => store.initialize(nextActivityId)
);
</script>
