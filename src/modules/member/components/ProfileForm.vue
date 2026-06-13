<template>
  <form class="form-grid" novalidate @submit.prevent="onSubmit">
    <label class="form-grid__full">
      <span>{{ t('member.name') }}</span>
      <input v-model="form.name" :aria-invalid="Boolean(nameError)" required />
      <small v-if="nameError" class="form-grid__error">{{ nameError }}</small>
    </label>
    <label class="form-grid__full">
      <span>{{ t('member.email') }}</span>
      <input v-model="form.email" type="email" :aria-invalid="Boolean(emailError)" required />
      <small v-if="emailError" class="form-grid__error">{{ emailError }}</small>
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
    <AppButton class="form-grid__full" type="submit" :disabled="saving">{{ t('common.save') }}</AppButton>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';
import { isEmail, isRequired } from '@/shared/utils/validation';

const MOBILE_PHONE_PATTERN = /^09\d{8}$/;

const props = defineProps({
  profile: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit']);

const { t } = useI18n();
const form = reactive({ ...props.profile });
const showErrors = ref(false);

const nameError = computed(() => {
  if (!showErrors.value) return '';
  return isRequired(form.name) ? '' : t('member.nameRequired');
});

const emailError = computed(() => {
  if (!showErrors.value) return '';
  return isEmail((form.email || '').trim()) ? '' : t('member.emailInvalid');
});

const phoneError = computed(() => {
  if (!showErrors.value) return '';
  return MOBILE_PHONE_PATTERN.test((form.phone || '').trim()) ? '' : t('member.phoneInvalid');
});

watch(
  () => props.profile,
  (value) => Object.assign(form, value),
  { deep: true }
);

function onPhoneInput(event) {
  form.phone = event.target.value.replace(/\D/g, '').slice(0, 10);
}

function onSubmit() {
  if (props.saving) return;

  const nameOk = isRequired(form.name);
  const emailOk = isEmail((form.email || '').trim());
  const phoneOk = MOBILE_PHONE_PATTERN.test((form.phone || '').trim());

  if (!nameOk || !emailOk || !phoneOk) {
    showErrors.value = true;
    return;
  }

  showErrors.value = false;
  emit('submit', {
    ...form,
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim()
  });
}
</script>
