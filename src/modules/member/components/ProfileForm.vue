<template>
  <form class="form-grid" novalidate @submit.prevent="onSubmit">
    <label class="form-grid__full">
      <span>{{ t('member.name') }}</span>
      <input v-model="form.name" required />
    </label>
    <label class="form-grid__full">
      <span>{{ t('member.email') }}</span>
      <input v-model="form.email" type="email" required />
    </label>
    <label class="form-grid__full">
      <span>{{ t('member.phone') }}</span>
      <input
        v-model="form.phone"
        type="tel"
        inputmode="numeric"
        maxlength="10"
        autocomplete="tel"
        :placeholder="t('member.phonePlaceholder')"
        :aria-invalid="Boolean(phoneError)"
        required
        @input="onPhoneInput"
      />
      <small v-if="phoneError" class="form-grid__error">{{ phoneError }}</small>
      <small v-else class="form-grid__hint">{{ t('member.phoneHint') }}</small>
    </label>
    <AppButton class="form-grid__full" type="submit">{{ t('common.save') }}</AppButton>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';

const MOBILE_PHONE_PATTERN = /^09\d{8}$/;

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit']);

const { t } = useI18n();
const form = reactive({ ...props.profile });
const showPhoneError = ref(false);

const phoneError = computed(() => {
  if (!showPhoneError.value) return '';
  return MOBILE_PHONE_PATTERN.test((form.phone || '').trim()) ? '' : t('member.phoneInvalid');
});

watch(
  () => props.profile,
  (value) => Object.assign(form, value),
  { deep: true }
);

function onPhoneInput(event) {
  form.phone = event.target.value.replace(/\D/g, '').slice(0, 10);
  if (showPhoneError.value) showPhoneError.value = !MOBILE_PHONE_PATTERN.test(form.phone);
}

function onSubmit() {
  if (!MOBILE_PHONE_PATTERN.test((form.phone || '').trim())) {
    showPhoneError.value = true;
    return;
  }
  showPhoneError.value = false;
  emit('submit', { ...form, phone: form.phone.trim() });
}
</script>
