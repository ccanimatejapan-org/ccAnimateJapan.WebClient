<template>
  <AddressForm
    :delivery-types="deliveryTypes"
    :address="editing"
    :saving="saving"
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
        <button v-if="!address.isDefault" type="button" @click="makeDefault(address.id)">
          {{ t('member.setDefault') }}
        </button>
        <button type="button" @click="editing = { ...address }">{{ t('member.edit') }}</button>
        <button type="button" class="address-card__delete" @click="remove(address.id)">
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

const { t } = useI18n();
const ui = useUiStore();
const addresses = ref([]);
const deliveryTypes = ref([]);
const editing = ref(null);
const saving = ref(false);

async function reload() {
  addresses.value = await getAddresses();
}

onMounted(async () => {
  try {
    const [types, list] = await Promise.all([getDeliveryTypes(), getAddresses()]);
    deliveryTypes.value = types;
    addresses.value = list;
  } catch (error) {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.loadFailed') });
  }
});

async function save(payload) {
  saving.value = true;
  try {
    if (editing.value) {
      await updateAddress(editing.value.id, payload);
    } else {
      await createAddress(payload);
    }
    editing.value = null;
    await reload();
  } catch {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.saveFailed') });
  } finally {
    saving.value = false;
  }
}

async function makeDefault(id) {
  try {
    await setDefaultAddress(id);
    await reload();
  } catch (error) {
    ui.showToast({ title: t('member.saveFailed'), message: t('member.saveFailed') });
  }
}

async function remove(id) {
  try {
    await deleteAddress(id);
    if (editing.value?.id === id) editing.value = null;
    await reload();
  } catch (error) {
    ui.showToast({ title: t('member.deleteFailed'), message: t('member.deleteFailed') });
  }
}
</script>

<style scoped lang="scss">
@use '../styles/address-book';
</style>
