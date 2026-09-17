<template>
  <section class="wish-pool-page">
    <header class="wish-pool-page__header">
      <div>
        <p class="eyebrow">{{ t('wishPool.eyebrow') }}</p>
        <h1>{{ t('wishPool.title') }}</h1>
        <p class="wish-pool-page__intro">{{ t('wishPool.description') }}</p>
      </div>
      <AppButton
        type="button"
        variant="primary"
        class="wish-pool-page__add-button"
        :aria-label="t('wishPool.addWish')"
        @click="openForm"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M11 4h2v16h-2z" fill="currentColor" />
          <path d="M4 11h16v2H4z" fill="currentColor" />
        </svg>
      </AppButton>
    </header>

    <AppLoading v-if="isLoading" :label="t('common.loading')" />
    <AppEmpty v-else-if="loadFailed" :message="t('wishPool.loadFailed')">
      <AppButton variant="secondary" @click="load(1)">{{ t('common.retry') }}</AppButton>
    </AppEmpty>
    <AppEmpty v-else-if="!items.length" :message="t('wishPool.empty')" />
    <div v-else class="wish-pool-page__grid">
      <WishPoolCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :reaction-pending="isReactionPending(item.id)"
        @react="onReaction"
      />
    </div>
    <AppPagination :page="page" :total-pages="totalPages" @update:page="goTo" />

    <AppModal v-model="isFormModalOpen" :title="t('wishPool.form.title')" fit-content>
      <WishPoolForm
        :animate-types="animateTypes"
        :animate-types-loading="animateTypesLoading"
        :animate-types-load-failed="animateTypesLoadFailed"
        :saving="isSubmitting"
        :reset-token="formResetToken"
        @submit="onSubmit"
        @cancel="isFormModalOpen = false"
        @retry-animate-types="retryAnimateTypes"
      />
    </AppModal>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import AppEmpty from '@/shared/components/AppEmpty.vue';
import AppButton from '@/shared/components/AppButton.vue';
import AppLoading from '@/shared/components/AppLoading.vue';
import AppModal from '@/shared/components/AppModal.vue';
import AppPagination from '@/shared/components/AppPagination.vue';
import { useUiStore } from '@/shared/stores/uiStore';
import WishPoolCard from '../components/WishPoolCard.vue';
import WishPoolForm from '../components/WishPoolForm.vue';
import { useWishPoolStore } from '../stores/wishPoolStore';

const { t } = useI18n();
const ui = useUiStore();
const wishPoolStore = useWishPoolStore();
const {
  items,
  page,
  totalPages,
  isLoading,
  loadFailed,
  animateTypes,
  animateTypesLoading,
  animateTypesLoadFailed,
  isSubmitting
} = storeToRefs(wishPoolStore);
const { load, goTo, isReactionPending } = wishPoolStore;
const isFormOpen = ref(false);
const formResetToken = ref(0);
const isFormModalOpen = computed({
  get: () => isFormOpen.value,
  set: (value) => {
    if (!value && isSubmitting.value) return;
    isFormOpen.value = value;
  }
});

function openForm() {
  isFormOpen.value = true;
  wishPoolStore.loadAnimateTypes().catch(() => {});
}

function retryAnimateTypes() {
  wishPoolStore.loadAnimateTypes(true).catch(() => {});
}

async function onSubmit(draft) {
  try {
    await wishPoolStore.createWishPool(draft);
    formResetToken.value += 1;
    isFormOpen.value = false;
    ui.showToast({ title: t('wishPool.toast.createSuccess'), message: t('wishPool.toast.createSuccessMessage') });
    await wishPoolStore.load(1);
  } catch (error) {
    const isDailyLimit = error?.apiStatus === '409' || error?.message === 'DAILY_WISH_LIMIT_REACHED';
    ui.showToast({
      type: 'warning',
      title: t('wishPool.toast.createFailed'),
      message: t(isDailyLimit ? 'wishPool.toast.dailyLimitMessage' : 'wishPool.toast.createFailedMessage')
    });
  }
}

async function onReaction(id) {
  try {
    await wishPoolStore.toggleReaction(id);
  } catch {
    ui.showToast({
      type: 'warning',
      title: t('wishPool.toast.reactionFailed'),
      message: t('wishPool.toast.reactionFailedMessage')
    });
  }
}

onMounted(() => wishPoolStore.load(1));
</script>

<style scoped lang="scss">
@use '../styles/wish-pool-page';
</style>
