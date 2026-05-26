<template>
  <form class="form-grid" @submit.prevent="$emit('submit', form)">
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
      <input v-model="form.phone" />
    </label>
    <AppButton class="form-grid__full" type="submit">{{ t('common.save') }}</AppButton>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/shared/components/AppButton.vue';

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

defineEmits(['submit']);

const { t } = useI18n();
const form = reactive({ ...props.profile });

watch(
  () => props.profile,
  (value) => Object.assign(form, value),
  { deep: true }
);
</script>
