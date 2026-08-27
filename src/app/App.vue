<template>
  <RouterView />
  <AppLoading
    v-if="ui.isGlobalLoading"
    class="app-loading--global"
    :label="t(ui.globalLoadingKey || 'common.loading')"
  />
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
