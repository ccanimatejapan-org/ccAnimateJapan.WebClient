<template>
  <form class="form-grid address-form" @submit.prevent="submit">
    <label>
      <span>{{ t('member.addressName') }}</span>
      <input v-model="form.name" required />
    </label>
    <label>
      <span>{{ t('member.receiver') }}</span>
      <input v-model="form.receiver" required />
    </label>
    <label>
      <span>{{ t('member.phone') }}</span>
      <input v-model="form.phone" required />
    </label>
    <label class="form-grid__full">
      <span>{{ t('member.address') }}</span>
      <input v-model="form.address" required />
    </label>
    <AppButton class="form-grid__full" type="submit">{{ t('member.addAddress') }}</AppButton>
  </form>
</template>

<script setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';

const emit = defineEmits(['submit']);
const { t } = useI18n();
const form = reactive({
  name: '',
  receiver: '',
  phone: '',
  address: ''
});

function submit() {
  emit('submit', { id: Date.now(), ...form });
  Object.assign(form, {
    name: '',
    receiver: '',
    phone: '',
    address: ''
  });
}
</script>

<style scoped lang="scss">
@use '../styles/address-form';
</style>
