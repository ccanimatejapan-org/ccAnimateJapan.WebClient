import { httpClient } from '@/shared/api/httpClient';

export async function getActivities(params = {}) {
  return httpClient.get('/activities', { params });
}
