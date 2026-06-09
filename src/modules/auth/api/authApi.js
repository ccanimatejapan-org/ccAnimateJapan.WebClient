import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

export async function login(payload) {
  return httpClient.post('/auth/login', payload);
}

export async function loginWithLiff(accessToken) {
  // accessToken comes from liff.getAccessToken(); the backend verifies it with LINE
  // and upserts the member, returning our own session token in `data.accessToken`.
  const response = await httpClient.post('/auth/line/login', { accessToken });
  return unwrapApiResponse(response, 'auth.loginFailed');
}
