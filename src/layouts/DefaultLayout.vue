<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <RouterLink class="site-header__brand" :to="{ name: ROUTE_NAMES.HOME }" @click="closeMenu">
          <img class="site-header__logo" :src="brandLogo" alt="" />
          <span class="site-header__brand-copy">
            <strong class="site-header__brand-name">CC日本動漫代購</strong>
            <small>YOUR LITTLE COLLECTION</small>
          </span>
        </RouterLink>
        <nav class="site-header__nav" :aria-label="t('nav.main')">
          <RouterLink
            v-for="item in desktopNavItems"
            :key="item.name"
            :to="{ name: item.name }"
            :class="{ 'is-active': isNavActive(item) }"
          >
            {{ t(item.label) }}
          </RouterLink>
        </nav>
        <div class="site-header__actions">
          <LanguageSwitcher />
          <RouterLink
            class="site-header__icon-button site-header__cart"
            :class="{ 'site-header__cart--bump': cartBumped }"
            :to="{ name: ROUTE_NAMES.CART }"
            :aria-label="cart.totalQuantity > 0
              ? t('nav.cartWithCount', { count: cart.totalQuantity })
              : t('nav.cart')"
            @click="closeMenu"
          >
            <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="NAV_ICONS.bag" />
            </svg>
            <span v-show="cart.totalQuantity > 0" class="site-header__badge">{{ cart.totalQuantity }}</span>
          </RouterLink>
          <button
            class="site-header__icon-button site-header__menu-toggle"
            type="button"
            :aria-label="isMenuOpen ? t('nav.closeMenu') : t('nav.menu')"
            :aria-expanded="isMenuOpen"
            aria-controls="site-mobile-menu"
            @click="toggleMenu"
          >
            <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="isMenuOpen ? 'm6 6 12 12M6 18 18 6' : 'M4 6h16M4 12h16M4 18h16'" />
            </svg>
          </button>
        </div>
      </div>

      <nav
        v-show="isMenuOpen"
        id="site-mobile-menu"
        class="site-mobile-menu"
        :aria-label="t('nav.main')"
      >
        <RouterLink
          v-for="(item, index) in mobileNavItems"
          :key="item.name"
          :ref="(el) => setMenuItemRef(el, index)"
          class="site-mobile-menu__item"
          :to="{ name: item.name }"
          :aria-current="isNavActive(item) ? 'page' : undefined"
          @click="closeMenu"
        >
          <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="NAV_ICONS[item.icon]" />
          </svg>
          <span>{{ t(item.label) }}</span>
          <span v-if="item.name === ROUTE_NAMES.CART && cart.totalQuantity > 0" class="site-mobile-menu__badge">
            {{ cart.totalQuantity }}
          </span>
        </RouterLink>
      </nav>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <div id="site-page-foot"></div>

    <footer class="site-footer">
      <p class="site-footer__tagline">{{ t('footer.copy') }}</p>
      <div class="site-footer__links">
        <RouterLink :to="{ name: ROUTE_NAMES.PURCHASE_NOTICE }">{{ t('footer.purchaseNotice') }}</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.USER_GUIDE }">{{ t('footer.userGuide') }}</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.PRIVACY_POLICY }">{{ t('footer.privacy') }}</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.TERMS }">{{ t('footer.terms') }}</RouterLink>
      </div>
      <div class="site-footer__links site-footer__links--contact" :aria-label="t('footer.contactGroup')">
        <a :href="externalLinks.lineOfficial" target="_blank" rel="noopener">{{ t('footer.lineOfficial') }}</a>
        <a :href="externalLinks.lineCommunity" target="_blank" rel="noopener">{{ t('footer.lineCommunity') }}</a>
        <a :href="externalLinks.instagram" target="_blank" rel="noopener">{{ t('footer.instagram') }}</a>
        <a :href="externalLinks.threads" target="_blank" rel="noopener">{{ t('footer.threads') }}</a>
      </div>
      <small class="site-footer__copyright">© ccAnimateJapan</small>
    </footer>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { externalLinks } from '@/shared/constants/externalLinks';
import { useCartStore } from '@/modules/cart/stores/cartStore';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher.vue';
import { useMobileMenu } from './useMobileMenu';
import brandLogo from '@/assets/logo/brand-logo.jpg';

const { t } = useI18n();
const route = useRoute();
const cart = useCartStore();
const cartBumped = ref(false);
const firstMobileMenuItem = ref(null);

const NAV_ICONS = {
  home: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  grid: 'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
  spark: 'm12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z',
  box: 'm3 7 9-4 9 4v11l-9 4-9-4ZM3 7l9 4 9-4M12 11v11M7 5l9 4',
  bag: 'M5 7h14l1 14H4L5 7ZM9 8V6a3 3 0 0 1 6 0v2',
  user: 'M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0'
};

// 各導覽項目在哪些路由下顯示為目前所在位置
const NAV_ITEMS = {
  home: { name: ROUTE_NAMES.HOME, label: 'nav.home', icon: 'home', match: [ROUTE_NAMES.HOME] },
  activities: {
    name: ROUTE_NAMES.ACTIVITY_LIST,
    label: 'nav.products',
    icon: 'grid',
    match: [ROUTE_NAMES.ACTIVITY_LIST, ROUTE_NAMES.ACTIVITY_PRODUCTS, ROUTE_NAMES.WORK_LIST, ROUTE_NAMES.WORK_ACTIVITIES]
  },
  wishPool: { name: ROUTE_NAMES.WISH_POOL, label: 'nav.wishPool', icon: 'spark', match: [ROUTE_NAMES.WISH_POOL] },
  orders: {
    name: ROUTE_NAMES.ORDER_LIST,
    label: 'nav.orders',
    icon: 'box',
    match: [ROUTE_NAMES.ORDER_LIST, ROUTE_NAMES.ORDER_DETAIL]
  },
  cart: { name: ROUTE_NAMES.CART, label: 'nav.cart', icon: 'bag', match: [ROUTE_NAMES.CART, ROUTE_NAMES.CHECKOUT] },
  member: {
    name: ROUTE_NAMES.MEMBER_CENTER,
    label: 'nav.member',
    icon: 'user',
    match: [ROUTE_NAMES.MEMBER_CENTER, ROUTE_NAMES.MEMBER_PROFILE, ROUTE_NAMES.MEMBER_ADDRESS_BOOK]
  }
};

const desktopNavItems = [NAV_ITEMS.home, NAV_ITEMS.activities, NAV_ITEMS.wishPool, NAV_ITEMS.orders, NAV_ITEMS.member];
const mobileNavItems = [
  NAV_ITEMS.home,
  NAV_ITEMS.activities,
  NAV_ITEMS.wishPool,
  NAV_ITEMS.orders,
  NAV_ITEMS.cart,
  NAV_ITEMS.member
];

function isNavActive(item) {
  return item.match.includes(route.name);
}

function setMenuItemRef(el, index) {
  if (index === 0) firstMobileMenuItem.value = el;
}
const {
  isMenuOpen,
  closeMenu,
  closeMenuOnEscape,
  focusMenuTarget,
  toggleMenu,
} = useMobileMenu();
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

watch(
  () => route.fullPath,
  () => {
    closeMenu();
  }
);

watch(isMenuOpen, async (menuOpen) => {
  if (!menuOpen) return;
  await nextTick();
  focusMenuTarget(firstMobileMenuItem.value);
});

onMounted(() => {
  cart.ensureHydrated();
  window.addEventListener('keydown', closeMenuOnEscape);
});

onBeforeUnmount(() => {
  window.cancelAnimationFrame(cartBumpFrame);
  window.clearTimeout(cartBumpTimer);
  window.removeEventListener('keydown', closeMenuOnEscape);
});
</script>

<style scoped lang="scss">
@use './styles/default-layout';
</style>
