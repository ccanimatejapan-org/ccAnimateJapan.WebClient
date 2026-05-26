<template>
  <section class="section narrow-section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('checkout.infoEyebrow') }}</p>
        <h1>{{ t('checkout.infoTitle') }}</h1>
      </div>
    </div>
    <ReceiverForm @submit="goPayment" />
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ReceiverForm from '../components/ReceiverForm.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const router = useRouter();
const { t } = useI18n();

function goPayment() {
  router.push({ name: ROUTE_NAMES.CHECKOUT_PAYMENT });
}
</script>
