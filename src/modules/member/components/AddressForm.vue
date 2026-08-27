<template>
  <form class="form-grid address-form" @submit.prevent="submit">
    <div class="address-form__field form-grid__full">
      <span>{{ t('member.deliveryMethod') }}</span>
      <div ref="deliveryPicker" class="address-form__delivery-picker">
        <button
          ref="deliveryTrigger"
          type="button"
          class="address-form__delivery-trigger"
          :disabled="saving || !usableTypes.length"
          :aria-expanded="isDeliveryMenuOpen"
          aria-haspopup="listbox"
          :aria-label="t('member.deliveryMethod')"
          @click="toggleDeliveryMenu"
          @keydown="handleDeliveryTriggerKeydown"
        >
          <span class="address-form__delivery-value">{{ selectedDeliveryType?.name || t('common.loading') }}</span>
          <span class="address-form__delivery-chevron" aria-hidden="true">⌄</span>
        </button>
        <div
          v-if="isDeliveryMenuOpen"
          class="address-form__delivery-menu"
          role="listbox"
          :aria-label="t('member.deliveryMethod')"
        >
          <button
            v-for="(type, index) in usableTypes"
            :key="type.id"
            type="button"
            class="address-form__delivery-option"
            :class="{ 'is-selected': type.id === form.deliveryTypeId }"
            role="option"
            :aria-selected="type.id === form.deliveryTypeId"
            @click="selectDeliveryType(type.id)"
            @keydown="handleDeliveryOptionKeydown($event, index)"
          >
            {{ type.name }}
          </button>
        </div>
      </div>
    </div>
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
      <AppButton type="submit" :disabled="saving">{{ submitLabel }}</AppButton>
      <button v-if="props.address" type="button" class="address-form__cancel" :disabled="saving" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { ADDRESS_KIND, requiresAddress } from '@/shared/constants/addressKind';
import { useAddressDraft } from '../composables/useAddressDraft';

const props = defineProps({
  deliveryTypes: {
    type: Array,
    default: () => []
  },
  address: {
    type: Object,
    default: null
  },
  saving: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['submit', 'cancel']);
const { t } = useI18n();

const usableTypes = computed(() => props.deliveryTypes.filter((type) => requiresAddress(type.addressKind)));

const deliveryPicker = ref(null);
const deliveryTrigger = ref(null);
const isDeliveryMenuOpen = ref(false);

const draft = useAddressDraft(props.address, usableTypes.value[0]?.id ?? null);
const { form } = draft;

const selectedDeliveryType = computed(() =>
  usableTypes.value.find((type) => type.id === form.deliveryTypeId) ?? usableTypes.value[0] ?? null
);

watch(usableTypes, (types) => {
  if (!form.deliveryTypeId && types.length) {
    form.deliveryTypeId = types[0].id;
  }
});

watch(
  () => props.address,
  (address) => draft.setAddress(address)
);

watch(() => props.resetToken, (token, previousToken) => {
  if (token !== previousToken) draft.resetAfterSuccess();
});

onMounted(() => document.addEventListener('click', closeDeliveryMenuOnOutsideClick));

onBeforeUnmount(() => document.removeEventListener('click', closeDeliveryMenuOnOutsideClick));

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

function openDeliveryMenu() {
  if (props.saving || !usableTypes.value.length) return;
  isDeliveryMenuOpen.value = true;
}

function closeDeliveryMenu() {
  isDeliveryMenuOpen.value = false;
}

function closeDeliveryMenuOnOutsideClick(event) {
  if (!deliveryPicker.value?.contains(event.target)) closeDeliveryMenu();
}

function toggleDeliveryMenu() {
  if (isDeliveryMenuOpen.value) {
    closeDeliveryMenu();
  } else {
    openDeliveryMenu();
  }
}

function selectDeliveryType(id) {
  form.deliveryTypeId = id;
  closeDeliveryMenu();
  deliveryTrigger.value?.focus();
}

function handleDeliveryTriggerKeydown(event) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openDeliveryMenu();
  }
}

function handleDeliveryOptionKeydown(event, index) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeDeliveryMenu();
    deliveryTrigger.value?.focus();
    return;
  }

  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return;

  event.preventDefault();
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? usableTypes.value.length - 1
      : (index + (event.key === 'ArrowDown' ? 1 : -1) + usableTypes.value.length) % usableTypes.value.length;
  nextTick(() => deliveryPicker.value?.querySelectorAll('[role="option"]')[nextIndex]?.focus());
}

function submit() {
  if (props.saving || !form.deliveryTypeId) return;
  emit('submit', draft.toPayload());
}
</script>

<style scoped lang="scss">
@use '../styles/address-form';
</style>
