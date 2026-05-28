import { httpClient } from '@/shared/api/httpClient';

export async function getActivities(params = {}) {
  const response = await httpClient.get('/activities', { params });
  return response.data;
}
