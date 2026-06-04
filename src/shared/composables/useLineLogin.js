export function useLineLogin() {
  function redirectToLineLogin() {
    const clientId = import.meta.env.VITE_LINE_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/line/callback`);
    const state = crypto.randomUUID();
    sessionStorage.setItem('line_login_state', state);
    // scope: profile openid（不取 email，需審核且後端不存）；bot_prompt 觸發加好友引導。
    window.location.href =
      `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid&bot_prompt=aggressive`;
  }

  return {
    redirectToLineLogin
  };
}
