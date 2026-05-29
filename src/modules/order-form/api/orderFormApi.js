import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

export async function getOrderForm(activityId) {
  try {
    const response = await httpClient.get(`/activities/${activityId}/order-form`);
    return unwrapApiResponse(response, 'orderForm.errors.formNotFound');
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'orderForm.errors.formNotFound');
  }
}

export async function submitOrder(payload) {
  try {
    const response = await httpClient.post(`/activities/${payload.activityId}/orders`, payload);
    return unwrapApiResponse(response, 'orderForm.errors.submitFailed');
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'orderForm.errors.submitFailed');
  }
}
