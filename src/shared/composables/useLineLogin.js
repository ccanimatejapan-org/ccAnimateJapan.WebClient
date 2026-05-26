export function useLineLogin() {
  function redirectToLineLogin() {
    const clientId = import.meta.env.VITE_LINE_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/line/callback`);
    const state = crypto.randomUUID();
    sessionStorage.setItem('line_login_state', state);
    window.location.href =
      `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid%20email`;
  }

  return {
    redirectToLineLogin
  };
}
