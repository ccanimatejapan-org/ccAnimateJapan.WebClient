import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

export async function login(payload) {
  return httpClient.post('/auth/login', payload, { skipAuthHandling: true });
}

export async function loginWithLiff(accessToken) {
  // accessToken comes from liff.getAccessToken(); the backend verifies it with LINE
  // and upserts the member, returning our own session token in `data.accessToken`.
  const response = await httpClient.post('/auth/line/login', { accessToken }, { skipAuthHandling: true });
  return unwrapApiResponse(response, 'auth.loginFailed');
}

export async function devLogin() {
  // 僅本地開發使用：後端 Development-only 端點，用 DB 第一筆有效會員發真實 JWT，
  // 回傳格式與 /auth/line/login 相同（{ accessToken, expiresAt, user }）。正式環境回 404。
  const response = await httpClient.post('/auth/dev-login', null, { skipAuthHandling: true });
  return unwrapApiResponse(response, 'auth.loginFailed');
}
