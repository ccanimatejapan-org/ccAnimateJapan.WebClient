<template>
  <section class="section">
    <header class="page-head">
      <p class="eyebrow">{{ t('cart.eyebrow') }}</p>
      <h1>{{ t('cart.title') }}</h1>
      <p class="page-head__desc">{{ t('cart.subtitle') }}</p>
    </header>

    <div v-if="cart.items.length" class="cart-layout">
      <div class="cart-list">
        <div class="cart-toolbar">
          <button
            type="button"
            class="ui-chip cart-toolbar__select-all"
            :disabled="!cart.selectableIds.length"
            @click="cart.setAllSelected(!cart.isAllSelected)"
          >
            {{ cart.isAllSelected ? t('cart.deselectAll') : t('cart.selectAll') }}
          </button>
          <span class="cart-toolbar__count">{{ t('cart.selectedCount', { count: cart.selection.activityCount }) }}</span>
        </div>
        <p v-if="cart.selection.activityCount > 1" class="notice">
          <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0" /></svg>
          <span>{{ t('cart.splitNotice', { count: cart.selection.activityCount }) }}</span>
        </p>
        <section
          v-for="group in cart.groups"
          :key="group.activityId"
          class="cart-group panel"
          :class="{ 'is-selected': isSelected(group), 'is-ended': !group.activityOrderable }"
        >
          <div class="cart-group__header">
            <h2 class="cart-group__title">
              <label class="cart-group__select">
                <input
                  class="cart-group__checkbox"
                  type="checkbox"
                  :checked="isSelected(group)"
                  :disabled="!group.activityOrderable"
                  @change="cart.toggleActivity(group.activityId)"
                />
                <span>{{ group.activityName || t('activity.unnamed') }}</span>
              </label>
            </h2>
            <AppPrice v-if="group.activityOrderable" :value="group.subtotal" />
            <span v-else class="cart-group__ended-badge">{{ t('cart.endedBadge') }}</span>
          </div>
          <p v-if="!group.activityOrderable" class="cart-group__ended-hint">{{ t('cart.activityEndedHint') }}</p>
          <OfficialShippingCard
            v-if="group.activityOrderable"
            :is-pre-order="group.activityIsPreOrder"
            :start-time="group.officialShippingStartTime"
            :end-time="group.officialShippingEndTime"
            variant="compact"
          />
          <CartItem v-for="item in group.items" :key="item.id" :item="item" :locked="!group.activityOrderable" />
        </section>
      </div>
      <CartSummary @submit="goCheckout" />
    </div>

    <AppEmpty v-else icon="bag" :message="t('cart.empty')">
      <RouterLink class="app-button app-button--dark" :to="{ name: ROUTE_NAMES.ACTIVITY_LIST }">
        {{ t('cart.goShopping') }}
      </RouterLink>
    </AppEmpty>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppPrice from '@/shared/components/AppPrice.vue';
import OfficialShippingCard from '@/shared/components/OfficialShippingCard.vue';
import CartItem from '../components/CartItem.vue';
import CartSummary from '../components/CartSummary.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useCartStore } from '../stores/cartStore';
import { formatActivityIds } from '../utils/cartSelection';

const router = useRouter();
const { t } = useI18n();
const cart = useCartStore();

// 每次進購物車都向後端重拿一次，活動是否已結束以當下為準
onMounted(() => {
  cart.hydrate();
});

function isSelected(group) {
  return cart.selectedActivityIds.includes(group.activityId);
}

function goCheckout() {
  const activityIds = cart.selectedGroups.map((group) => group.activityId);
  if (!activityIds.length) return;
  router.push({ name: ROUTE_NAMES.CHECKOUT, query: { activities: formatActivityIds(activityIds) } });
}
</script>

<style scoped lang="scss">
@use '../styles/cart-page';
</style>
