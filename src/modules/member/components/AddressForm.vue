<template>
  <form class="form-grid address-form" @submit.prevent="submit">
    <label class="form-grid__full">
      <span>{{ t('member.deliveryMethod') }}</span>
      <select v-model.number="form.deliveryTypeId" required>
        <option v-for="type in usableTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
      </select>
    </label>
    <label class="form-grid__full">
      <span>{{ t('member.label') }}</span>
      <input v-model="form.addressName" :placeholder="labelPlaceholder" />
    </label>
    <label class="form-grid__full">
      <span>{{ t('member.field.address') }}</span>
      <input v-model="form.address" :placeholder="addressPlaceholder" required />
    </label>
    <label class="address-form__default form-grid__full">
      <input v-model="form.isDefault" type="checkbox" />
      <span>{{ t('member.setDefault') }}</span>
    </label>
    <div class="address-form__buttons form-grid__full">
      <AppButton type="submit">{{ submitLabel }}</AppButton>
      <button v-if="props.address" type="button" class="address-form__cancel" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { ADDRESS_KIND, requiresAddress } from '@/shared/constants/addressKind';

const props = defineProps({
  deliveryTypes: {
    type: Array,
    default: () => []
  },
  address: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['submit', 'cancel']);
const { t } = useI18n();

const usableTypes = computed(() => props.deliveryTypes.filter((type) => requiresAddress(type.addressKind)));

function blankForm() {
  return {
    deliveryTypeId: props.address?.deliveryTypeId ?? usableTypes.value[0]?.id ?? null,
    addressName: props.address?.addressName ?? '',
    address: props.address?.address ?? '',
    isDefault: props.address?.isDefault ?? false
  };
}

const form = reactive(blankForm());

watch(usableTypes, (types) => {
  if (!form.deliveryTypeId && types.length) {
    form.deliveryTypeId = types[0].id;
  }
});

watch(
  () => props.address,
  () => Object.assign(form, blankForm())
);

const selectedKind = computed(
  () => usableTypes.value.find((type) => type.id === form.deliveryTypeId)?.addressKind ?? ADDRESS_KIND.HOME_DELIVERY
);

const addressPlaceholder = computed(() =>
  selectedKind.value === ADDRESS_KIND.STORE_PICKUP ? t('member.addressHint.store') : t('member.addressHint.home')
);

const labelPlaceholder = computed(() =>
  selectedKind.value === ADDRESS_KIND.STORE_PICKUP ? t('member.labelHint.store') : t('member.labelHint.home')
);

const submitLabel = computed(() => (props.address ? t('common.save') : t('member.addAddress')));

function submit() {
  emit('submit', {
    deliveryTypeId: form.deliveryTypeId,
    addressName: form.addressName,
    address: form.address,
    isDefault: form.isDefault
  });

  if (!props.address) {
    const keepDeliveryTypeId = form.deliveryTypeId;
    Object.assign(form, blankForm());
    form.deliveryTypeId = keepDeliveryTypeId;
  }
}
</script>

<style scoped lang="scss">
@use '../styles/address-form';
</style>
