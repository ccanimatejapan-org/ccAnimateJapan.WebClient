<template>
  <AppLoading v-if="ui.isGlobalLoading" :label="t(ui.globalLoadingKey || 'auth.processingLine')" />
  <RouterView v-else />
  <AppToast />
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppLoading from '@/shared/components/AppLoading.vue';
import AppToast from '@/shared/components/AppToast.vue';
import { useUiStore } from '@/shared/stores/uiStore';

const ui = useUiStore();
const { t } = useI18n();
</script>
