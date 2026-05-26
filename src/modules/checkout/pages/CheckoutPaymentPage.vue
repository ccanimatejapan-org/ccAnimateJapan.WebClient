<template>
  <section class="section narrow-section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('checkout.paymentEyebrow') }}</p>
        <h1>{{ t('checkout.paymentTitle') }}</h1>
      </div>
    </div>
    <PaymentMethod v-model="method" />
    <AppButton @click="completeOrder">{{ t('checkout.placeOrder') }}</AppButton>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import PaymentMethod from '../components/PaymentMethod.vue';
import { createOrder } from '../api/checkoutApi';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const router = useRouter();
const { t } = useI18n();
const cart = useCartStore();
const method = ref('credit-card');

async function completeOrder() {
  await createOrder({
    paymentMethod: method.value,
    items: cart.items
  });
  cart.clearCart();
  router.push({ name: ROUTE_NAMES.CHECKOUT_COMPLETE });
}
</script>
