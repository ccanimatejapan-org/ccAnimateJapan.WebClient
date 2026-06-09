import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';
import { shouldUseMockApi } from '@/shared/api/mockMode';

export async function login(payload) {
  if (shouldUseMockApi()) {
    return Promise.resolve({
      accessToken: 'dev-token',
      user: {
        id: 1,
        name: payload.email,
        email: payload.email
      }
    });
  }

  return httpClient.post('/auth/login', payload);
}

export async function loginWithLiff(accessToken) {
  if (shouldUseMockApi()) {
    return Promise.resolve({
      accessToken: 'dev-line-token',
      user: {
        id: 2,
        name: 'LINE User',
        email: ''
      }
    });
  }

  // accessToken comes from liff.getAccessToken(); the backend verifies it with LINE
  // and upserts the member, returning our own session token in `data.accessToken`.
  const response = await httpClient.post('/auth/line/login', { accessToken });
  return unwrapApiResponse(response, 'auth.loginFailed');
}
