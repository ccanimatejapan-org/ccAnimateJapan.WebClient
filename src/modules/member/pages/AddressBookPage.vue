<template>
  <section class="section narrow-section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('member.eyebrow') }}</p>
        <h1>{{ t('member.addressBook') }}</h1>
      </div>
      <RouterLink
        class="app-button app-button--secondary"
        :to="{ name: ROUTE_NAMES.MEMBER_PROFILE }"
      >
        {{ t('member.profile') }}
      </RouterLink>
    </div>

    <AddressForm
      :delivery-types="deliveryTypes"
      :address="editing"
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
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AddressForm from '../components/AddressForm.vue';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { useUiStore } from '@/shared/stores/uiStore';
import {
  createAddress,
  deleteAddress,
  getAddresses,
  getDeliveryTypes,
  setDefaultAddress,
  updateAddress
} from '../api/memberApi';

const { t } = useI18n();
const ui = useUiStore();
const addresses = ref([]);
const deliveryTypes = ref([]);
const editing = ref(null);

async function reload() {
  addresses.value = await getAddresses();
}

onMounted(async () => {
  try {
    const [types, list] = await Promise.all([getDeliveryTypes(), getAddresses()]);
    deliveryTypes.value = types;
    addresses.value = list;
  } catch (error) {
    ui.showToast({ title: t('member.saveFailed'), message: t(error.message || 'member.loadFailed') });
  }
});

async function save(payload) {
  try {
    if (editing.value) {
      await updateAddress(editing.value.id, payload);
    } else {
      await createAddress(payload);
    }
    editing.value = null;
    await reload();
  } catch (error) {
    ui.showToast({ title: t('member.saveFailed'), message: t(error.message || 'member.saveFailed') });
  }
}

async function makeDefault(id) {
  try {
    await setDefaultAddress(id);
    await reload();
  } catch (error) {
    ui.showToast({ title: t('member.saveFailed'), message: t(error.message || 'member.saveFailed') });
  }
}

async function remove(id) {
  try {
    await deleteAddress(id);
    if (editing.value?.id === id) editing.value = null;
    await reload();
  } catch (error) {
    ui.showToast({ title: t('member.deleteFailed'), message: t(error.message || 'member.deleteFailed') });
  }
}
</script>

<style scoped lang="scss">
@use '../styles/address-book';
</style>
