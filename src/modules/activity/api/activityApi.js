import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

export async function getActivities(params = {}) {
  const response = await httpClient.get('/activities', { params });
  return unwrapApiResponse(response, 'activity.loadFailed');
}
