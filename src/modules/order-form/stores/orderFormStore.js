import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { isEmail, isRequired } from '@/shared/utils/validation';
import { getOrderForm, submitMockOrder } from '../api/orderFormApi';

const INITIAL_FORM = {
  subscriberName: '',
  subscriberEmail: '',
  subscriberPhone: '',
  agreedToTerms: false
};

function isGmail(value) {
  return isEmail(value) && String(value).trim().toLowerCase().endsWith('@gmail.com');
}

export const useOrderFormStore = defineStore('orderForm', () => {
  const activityId = ref(null);
  const activity = ref(null);
  const agreement = ref(null);
  const products = ref([]);
  const quantities = reactive({});
  const form = reactive({ ...INITIAL_FORM });
  const currentStep = ref(1);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const loadError = ref(null);
  const submitError = ref(null);
  const fieldErrors = reactive({});
  const submitResult = ref(null);
  let initializeRun = 0;

  const selectedItems = computed(() =>
    products.value
      .map((product) => {
        const amount = Number(quantities[product.id] || 0);
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          amount,
          subTotal: product.price * amount,
          imageUrl: product.imageUrl,
          info: product.info
        };
      })
      .filter((item) => item.amount > 0)
  );

  const total = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.subTotal, 0)
  );

  const totalQuantity = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.amount, 0)
  );

  function resetFieldErrors() {
    Object.keys(fieldErrors).forEach((key) => {
      delete fieldErrors[key];
    });
  }

  function resetDraft() {
    Object.assign(form, INITIAL_FORM);
    Object.keys(quantities).forEach((key) => {
      delete quantities[key];
    });
    currentStep.value = 1;
    submitResult.value = null;
    submitError.value = null;
    resetFieldErrors();
  }

  async function initialize(nextActivityId) {
    const runId = initializeRun + 1;
    initializeRun = runId;
    resetDraft();
    activityId.value = Number(nextActivityId);
    isLoading.value = true;
    loadError.value = null;

    try {
      const result = await getOrderForm(nextActivityId);
      if (runId !== initializeRun) return;

      activity.value = result.activity;
      agreement.value = result.agreement;
      products.value = result.products;
      result.products.forEach((product) => {
        quantities[product.id] = 0;
      });
    } catch (err) {
      if (runId !== initializeRun) return;

      loadError.value = err;
      activity.value = null;
      agreement.value = null;
      products.value = [];
    } finally {
      if (runId === initializeRun) {
        isLoading.value = false;
      }
    }
  }

  function setQuantity(productId, amount) {
    const product = products.value.find((entry) => entry.id === Number(productId));
    const maxAmount = Number.isFinite(Number(product?.amount)) ? Number(product.amount) : Infinity;
    const nextAmount = Math.min(maxAmount, Math.max(0, Math.floor(Number(amount) || 0)));
    quantities[productId] = nextAmount;
  }

  function validateAgreement() {
    resetFieldErrors();
    if (!form.agreedToTerms) {
      fieldErrors.agreedToTerms = 'orderForm.errors.agreeRequired';
      return false;
    }
    return true;
  }

  function validateBasicInfo() {
    resetFieldErrors();
    if (!isRequired(form.subscriberName)) {
      fieldErrors.subscriberName = 'orderForm.errors.nameRequired';
    }
    if (!isGmail(form.subscriberEmail)) {
      fieldErrors.subscriberEmail = 'orderForm.errors.gmailRequired';
    }
    return Object.keys(fieldErrors).length === 0;
  }

  function validateProducts() {
    resetFieldErrors();
    if (selectedItems.value.length === 0) {
      fieldErrors.products = 'orderForm.errors.productsRequired';
      return false;
    }
    return true;
  }

  function validateCurrentStep() {
    if (currentStep.value === 1) return validateAgreement();
    if (currentStep.value === 2) return validateBasicInfo();
    if (currentStep.value === 3) return validateProducts();
    resetFieldErrors();
    return validateAgreement() && validateBasicInfo() && validateProducts();
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    currentStep.value = Math.min(4, currentStep.value + 1);
  }

  function previousStep() {
    resetFieldErrors();
    currentStep.value = Math.max(1, currentStep.value - 1);
  }

  function goToStep(step) {
    const targetStep = Math.min(4, Math.max(1, Number(step) || 1));
    if (targetStep <= currentStep.value) {
      resetFieldErrors();
      currentStep.value = targetStep;
    }
  }

  function buildSubmitPayload() {
    return {
      activityId: activityId.value,
      subscriberName: form.subscriberName.trim(),
      subscriberEmail: form.subscriberEmail.trim(),
      subscriberPhone: form.subscriberPhone.trim(),
      total: total.value,
      items: selectedItems.value.map((item) => ({
        productId: item.productId,
        amount: item.amount,
        price: item.price,
        subTotal: item.subTotal,
        info: item.info
      }))
    };
  }

  async function submitOrder() {
    if (!validateAgreement() || !validateBasicInfo() || !validateProducts()) {
      return null;
    }

    isSubmitting.value = true;
    submitError.value = null;

    try {
      const result = await submitMockOrder(buildSubmitPayload());
      submitResult.value = result;
      return result;
    } catch (err) {
      submitError.value = err;
      return null;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    activityId,
    activity,
    agreement,
    products,
    quantities,
    form,
    currentStep,
    isLoading,
    isSubmitting,
    loadError,
    submitError,
    fieldErrors,
    submitResult,
    selectedItems,
    total,
    totalQuantity,
    initialize,
    setQuantity,
    validateCurrentStep,
    nextStep,
    previousStep,
    goToStep,
    submitOrder,
    resetDraft
  };
});
