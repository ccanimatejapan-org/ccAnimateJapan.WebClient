export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
}

export function isTaiwanMobile(value) {
  return /^09\d{8}$/.test(String(value || ''));
}
