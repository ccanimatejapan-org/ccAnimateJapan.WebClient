<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="site-header__brand" :to="{ name: ROUTE_NAMES.HOME }">
        <img class="site-header__logo" :src="brandLogo" alt="CC日本動漫代購" />
        <span class="site-header__brand-copy">
          <span class="site-header__brand-name">CC日本動漫代購</span>
          <small>角色周邊小舖</small>
        </span>
      </RouterLink>
      <nav class="site-header__nav" aria-label="Main">
        <RouterLink :to="{ name: ROUTE_NAMES.HOME, hash: '#activities' }">
          {{ t('nav.products') }}
        </RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.ORDER_LIST }">
          {{ t('nav.orders') }}
        </RouterLink>
      </nav>
      <RouterLink
        class="site-header__cart"
        :class="{ 'site-header__cart--bump': cartBumped }"
        :to="{ name: ROUTE_NAMES.CART }"
        :aria-label="cart.totalQuantity > 0
          ? t('nav.cartWithCount', { count: cart.totalQuantity })
          : t('nav.cart')"
      >
        <svg
          class="site-header__cart-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="18" cy="20" r="1.4" />
          <path d="M2.5 3h2.2l2.1 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21.5 7H6" />
        </svg>
        <span v-show="cart.totalQuantity > 0">{{ cart.totalQuantity }}</span>
      </RouterLink>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="site-footer__brand">ccAnimateJapan</div>
      <div class="site-footer__groups">
        <div class="site-footer__group">
          <h2 class="site-footer__heading">{{ t('footer.contactGroup') }}</h2>
          <a :href="externalLinks.lineOfficial" target="_blank" rel="noopener">
            {{ t('footer.lineOfficial') }}
          </a>
          <a :href="externalLinks.lineCommunity" target="_blank" rel="noopener">
            {{ t('footer.lineCommunity') }}
          </a>
          <a :href="externalLinks.instagram" target="_blank" rel="noopener">
            {{ t('footer.instagram') }}
          </a>
        </div>
        <div class="site-footer__group">
          <h2 class="site-footer__heading">{{ t('footer.shopGroup') }}</h2>
          <a :href="externalLinks.purchaseNotice" target="_blank" rel="noopener">
            {{ t('footer.purchaseNotice') }}
          </a>
          <a :href="externalLinks.userGuide" target="_blank" rel="noopener">
            {{ t('footer.userGuide') }}
          </a>
        </div>
      </div>
      <div class="site-footer__bottom">
        <span>© ccAnimateJapan</span>
        <span class="site-footer__legal">
          <a href="#">{{ t('footer.privacy') }}</a>
          <a href="#">{{ t('footer.terms') }}</a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { externalLinks } from '@/shared/constants/externalLinks';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import brandLogo from '@/assets/logo/brand-logo.jpg';

const { t } = useI18n();
const cart = useCartStore();
const cartBumped = ref(false);
let cartBumpFrame;
let cartBumpTimer;

watch(
  () => cart.totalQuantity,
  (quantity, previousQuantity) => {
    if (quantity <= previousQuantity) return;
    cartBumped.value = false;
    window.cancelAnimationFrame(cartBumpFrame);
    window.clearTimeout(cartBumpTimer);
    cartBumpFrame = window.requestAnimationFrame(() => {
      cartBumped.value = true;
      cartBumpTimer = window.setTimeout(() => {
        cartBumped.value = false;
      }, 420);
    });
  }
);

onBeforeUnmount(() => {
  window.cancelAnimationFrame(cartBumpFrame);
  window.clearTimeout(cartBumpTimer);
});
</script>

<style scoped lang="scss">
@use './styles/default-layout';
</style>
