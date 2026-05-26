<template>
  <form class="form-grid" @submit.prevent="$emit('submit', form)">
    <label>
      <span>{{ t('checkout.receiver.name') }}</span>
      <input v-model="form.name" required />
    </label>
    <label>
      <span>{{ t('checkout.receiver.phone') }}</span>
      <input v-model="form.phone" required />
    </label>
    <label class="form-grid__full">
      <span>{{ t('checkout.receiver.address') }}</span>
      <input v-model="form.address" required />
    </label>
    <AppButton class="form-grid__full" type="submit">{{ t('common.next') }}</AppButton>
  </form>
</template>

<script setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';

defineEmits(['submit']);

const { t } = useI18n();
const form = reactive({
  name: '',
  phone: '',
  address: ''
});
</script>
