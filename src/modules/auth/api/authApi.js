import { httpClient } from '@/shared/api/httpClient';

export async function login(payload) {
  if (import.meta.env.DEV) {
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
  if (import.meta.env.DEV) {
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

  return httpClient.post('/auth/line/callback', { code });
}
