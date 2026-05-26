<template>
  <section class="section narrow-section">
    <div class="section__header">
      <div>
        <p class="eyebrow">{{ t('member.eyebrow') }}</p>
        <h1>{{ t('member.addressBook') }}</h1>
      </div>
    </div>

    <AddressForm @submit="addresses.push($event)" />

    <div class="address-list">
      <article v-for="address in addresses" :key="address.id || address.name" class="address-card">
        <h3>{{ address.name }}</h3>
        <p>{{ address.receiver }} / {{ address.phone }}</p>
        <p>{{ address.address }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AddressForm from '../components/AddressForm.vue';
import { getAddresses } from '../api/memberApi';

const { t } = useI18n();
const addresses = ref([]);

onMounted(async () => {
  addresses.value = await getAddresses();
});
</script>

<style scoped lang="scss">
@use '../styles/address-book';
</style>
