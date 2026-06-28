const VERSION_STORAGE_KEY = 'ccAnimateJapan.reloadedForVersion';
const POLL_INTERVAL_MS = 5 * 60 * 1000;

const currentVersion = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '';

let checking = false;

async function fetchLatestVersion() {
  const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) return '';
  const data = await res.json();
  return typeof data?.version === 'string' ? data.version : '';
}

function reloadForVersion(nextVersion) {
  if (!nextVersion) return;

  let alreadyTried = '';
  try {
    alreadyTried = sessionStorage.getItem(VERSION_STORAGE_KEY) || '';
  } catch {
    alreadyTried = '';
  }
  if (alreadyTried === nextVersion) return;

  try {
    sessionStorage.setItem(VERSION_STORAGE_KEY, nextVersion);
  } catch {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('v', nextVersion);
  window.location.replace(url.toString());
}

export async function checkForUpdate() {
  if (checking || !currentVersion) return;
  checking = true;
  try {
    const latest = await fetchLatestVersion();
    if (latest && latest !== currentVersion) reloadForVersion(latest);
  } catch {
    return;
  } finally {
    checking = false;
  }
}

export function installVersionGuard(router) {
  checkForUpdate();

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    });
  }

  if (router && typeof router.afterEach === 'function') {
    router.afterEach(() => {
      checkForUpdate();
    });
  }

  if (typeof window !== 'undefined') {
    window.setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        checkForUpdate();
      }
    }, POLL_INTERVAL_MS);
  }
}
