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

export async function loginWithLine(code) {
  if (shouldUseMockApi()) {
    return Promise.resolve({
      accessToken: 'dev-line-token',
      user: {
        id: 2,
        name: 'LINE User',
        email: ''
      },
      code
    });
  }

  // redirectUri must match the one used in the authorize request (useLineLogin.js).
  const redirectUri = `${window.location.origin}/auth/line/callback`;
  const response = await httpClient.post('/auth/line/callback', { code, redirectUri });
  return unwrapApiResponse(response, 'auth.loginFailed');
}
