<template>
  <AddressForm
    :delivery-types="deliveryTypes"
    :address="editing"
    :saving="isMutating"
    :reset-token="resetToken"
    @submit="save"
    @cancel="editing = null"
  />

  <div class="address-list">
    <article v-for="address in addresses" :key="address.id" class="address-card">
      <header class="address-card__header">
        <h3>{{ address.addressName || address.deliveryTypeName }}</h3>
        <span v-if="address.isDefault" class="address-card__badge">{{ t('member.default') }}</span>
      </header>
      <p class="address-card__method">{{ address.deliveryTypeName }}</p>
      <p>{{ address.address }}</p>
      <div class="address-card__actions">
        <button v-if="!address.isDefault" type="button" :disabled="isMutating" @click="makeDefault(address.id)">
          {{ t('member.setDefault') }}
        </button>
        <button type="button" :disabled="isMutating" @click="editing = { ...address }">{{ t('member.edit') }}</button>
        <button type="button" class="address-card__delete" :disabled="isMutating" @click="remove(address.id)">
          {{ t('member.delete') }}
        </button>
      </div>
    </article>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/shared/stores/uiStore';
import {
  createAddress,
  deleteAddress,
  getAddresses,
  getDeliveryTypes,
  setDefaultAddress,
  updateAddress
} from '../api/memberApi';
import AddressForm from './AddressForm.vue';
import { useAddressBook } from '../composables/useAddressBook';

const { t } = useI18n();
const ui = useUiStore();
const deliveryTypes = ref([]);
const editing = ref(null);
const resetToken = ref(0);
const addressBook = useAddressBook({ getAddresses, createAddress, updateAddress, setDefaultAddress, deleteAddress });
const { addresses, isMutating } = addressBook;

onMounted(async () => {
  try {
    const [types] = await Promise.all([getDeliveryTypes(), addressBook.reload()]);
    deliveryTypes.value = types;
  } catch (error) {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.loadFailed') });
  }
});

async function save(payload) {
  try {
    const saved = await addressBook.save(editing.value?.id, payload);
    if (saved) {
      editing.value = null;
      resetToken.value += 1;
    }
  } catch {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.saveFailed') });
  }
}

async function makeDefault(id) {
  try {
    await addressBook.makeDefault(id);
  } catch {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.saveFailed') });
  }
}

async function remove(id) {
  try {
    await addressBook.remove(id);
    if (editing.value?.id === id) editing.value = null;
  } catch {
    ui.showToast({ title: t('member.deleteFailed'), message: t('member.deleteFailed') });
  }
}
</script>

<style scoped lang="scss">
@use '../styles/address-book';
</style>
