import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';
import { buildWishPoolFormData } from '../utils/wishPoolPayload';

export async function getWishPools({ page = 1, pageSize = 12 } = {}) {
  const response = await httpClient.get('/wish-pools', { params: { page, pageSize } });
  const data = unwrapApiResponse(response, 'wishPool.loadFailed');
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: Math.max(0, Number(data?.totalCount) || 0)
  };
}

export async function getWishPoolAnimateTypes() {
  const response = await httpClient.get('/wish-pools/animate-types');
  return unwrapApiResponse(response, 'wishPool.form.animateTypesLoadFailed');
}

export async function createWishPool(draft) {
  const payload = draft instanceof FormData ? draft : buildWishPoolFormData(draft);
  const response = await httpClient.post('/wish-pools', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrapApiResponse(response, 'wishPool.toast.createFailed');
}

export async function toggleWishPoolReaction(id) {
  const response = await httpClient.post(`/wish-pools/${encodeURIComponent(id)}/reaction`);
  return unwrapApiResponse(response, 'wishPool.toast.reactionFailed');
}
