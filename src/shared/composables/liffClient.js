import liff from '@line/liff';

const LIFF_ID = import.meta.env.VITE_LIFF_ID;

let initPromise = null;

// True only when a LIFF ID is configured. Real mode without an ID should degrade
// gracefully (back to the login page), not crash; mock mode never reaches here.
export function isLiffConfigured() {
  return Boolean(LIFF_ID);
}

// Idempotent: the router guard runs on every navigation, so liff.init() must run
// at most once. On failure we clear the cache so a manual retry can re-init.
export function ensureLiffReady() {
  if (!initPromise) {
    initPromise = liff.init({ liffId: LIFF_ID }).catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

export function isInClient() {
  return liff.isInClient();
}

export function isLoggedIn() {
  return liff.isLoggedIn();
}

// External browser only: redirects to LINE login and returns to redirectUri.
// Inside the LINE in-app browser this is unnecessary — liff.init() logs in already.
export function login(redirectUri) {
  liff.login({ redirectUri });
}

// Requires the LINE Official Account to be linked to the same LINE Login channel
// as this LIFF app, otherwise the SDK rejects.
export async function getFriendFlag() {
  const { friendFlag } = await liff.getFriendship();
  return friendFlag;
}

export function getAccessToken() {
  return liff.getAccessToken();
}
