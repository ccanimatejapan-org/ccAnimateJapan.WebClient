function readMockFlag(value, defaultValue) {
  if (value == null || value === '') return defaultValue;

  const normalized = String(value).trim().toLowerCase();
  return !['false', '0', 'off', 'no'].includes(normalized);
}

export function shouldUseMockApi() {
  return readMockFlag(import.meta.env.VITE_USE_MOCK_API, true);
}

export function shouldUseOrderFormMockApi() {
  return readMockFlag(import.meta.env.VITE_ORDER_FORM_USE_MOCK_API, false);
}
