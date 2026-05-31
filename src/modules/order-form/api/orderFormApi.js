import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';
import { shouldUseOrderFormMockApi } from '@/shared/api/mockMode';
import { createMockActivities } from '@/modules/activity/api/activityApi';
import { createMockProducts } from '@/modules/product/api/productApi';

function createMockOrderForm(activityId) {
  const normalizedActivityId = Number(activityId);
  const activity =
    createMockActivities().find((item) => item.id === normalizedActivityId) || null;

  if (!activity) {
    throw new Error('orderForm.errors.formNotFound');
  }

  return {
    activity,
    agreement: {
      titleKey: 'orderForm.agreement.title',
      contentKeys: [
        'orderForm.agreement.ruleContact',
        'orderForm.agreement.ruleConfirmation',
        'orderForm.agreement.ruleZeroQuantity'
      ]
    },
    products: createMockProducts({ activityId: normalizedActivityId }).map((product) => ({
      ...product,
      info: product.info ?? product.note ?? ''
    }))
  };
}

function createMockSubmitResult(payload) {
  const id = Date.now();
  return {
    id,
    orderNo: `MOCK${String(id).slice(-8)}`,
    ...payload
  };
}

export async function getOrderForm(activityId) {
  if (shouldUseOrderFormMockApi()) {
    return Promise.resolve(createMockOrderForm(activityId));
  }

  try {
    const response = await httpClient.get(`/activities/${activityId}/order-form`);
    return unwrapApiResponse(response, 'orderForm.errors.formNotFound');
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'orderForm.errors.formNotFound');
  }
}

export async function submitOrder(payload) {
  if (shouldUseOrderFormMockApi()) {
    return Promise.resolve(createMockSubmitResult(payload));
  }

  try {
    const response = await httpClient.post(`/activities/${payload.activityId}/orders`, payload);
    return unwrapApiResponse(response, 'orderForm.errors.submitFailed');
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'orderForm.errors.submitFailed');
  }
}
