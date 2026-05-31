<template>
  <section class="section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('cart.eyebrow') }}</p>
        <h1>{{ t('cart.title') }}</h1>
      </div>
    </div>

    <div v-if="cart.items.length" class="cart-layout">
      <div class="cart-list">
        <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
      </div>
      <CartSummary :is-submitting="isSubmitting" @submit="submitOrder" />
    </div>

    <AppEmpty v-else :message="t('cart.empty')">
      <RouterLink class="app-button app-button--primary" :to="{ name: ROUTE_NAMES.HOME }">
        {{ t('cart.goShopping') }}
      </RouterLink>
    </AppEmpty>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import CartItem from '../components/CartItem.vue';
import CartSummary from '../components/CartSummary.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useUiStore } from '@/shared/stores/uiStore';
import { createOrderFromCartItems } from '@/modules/order/api/orderApi';
import { useCartStore } from '../stores/cartStore';

const router = useRouter();
const { t } = useI18n();
const cart = useCartStore();
const ui = useUiStore();
const isSubmitting = ref(false);

async function submitOrder() {
  if (!cart.items.length || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const order = await createOrderFromCartItems(cart.items);
    cart.clearCart();
    ui.showToast({
      title: t('cart.toast.orderCreatedTitle'),
      message: t('cart.toast.orderCreatedMessage', { orderNo: order.orderNo }),
      actionLabel: t('order.viewOrders'),
      actionTo: { name: ROUTE_NAMES.ORDER_LIST }
    });
    router.push({ name: ROUTE_NAMES.ORDER_LIST });
  } catch (error) {
    const messageKey = error.message || 'cart.toast.submitFailedMessage';
    ui.showToast({
      title: t('cart.toast.submitFailedTitle'),
      message: t(messageKey)
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '../styles/cart-page';
</style>
