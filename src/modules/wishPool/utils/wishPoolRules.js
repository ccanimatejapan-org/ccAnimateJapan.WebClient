const MAX_ACTIVITY_NAME_LENGTH = 200;
const MAX_PRODUCT_URL_LENGTH = 2048;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const IMAGE_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif'
};

export function isValidProductUrl(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) return true;
  if (normalized.length > MAX_PRODUCT_URL_LENGTH) return false;

  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateImageFile(file) {
  if (!file) return { valid: true, error: null };
  if (Number(file.size) <= 0) {
    return { valid: false, error: 'wishPool.validation.imageEmpty' };
  }
  if (Number(file.size) > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'wishPool.validation.imageTooLarge' };
  }

  const extension = String(file.name || '').split('.').pop().toLowerCase();
  if (!IMAGE_TYPES[extension] || file.type !== IMAGE_TYPES[extension]) {
    return { valid: false, error: 'wishPool.validation.imageTypeInvalid' };
  }

  return { valid: true, error: null };
}

export function validateWishPoolDraft(draft = {}) {
  const errors = {};
  const animateTypeId = typeof draft.animateTypeId === 'string' ? draft.animateTypeId.trim() : draft.animateTypeId;
  const activityName = typeof draft.activityName === 'string' ? draft.activityName.trim() : '';

  if (animateTypeId === '' || animateTypeId === null || animateTypeId === undefined || animateTypeId === 0) {
    errors.animateTypeId = 'wishPool.validation.animateTypeRequired';
  }
  if (!activityName) {
    errors.activityName = 'wishPool.validation.activityNameRequired';
  } else if (activityName.length > MAX_ACTIVITY_NAME_LENGTH) {
    errors.activityName = 'wishPool.validation.activityNameTooLong';
  }
  if (!isValidProductUrl(draft.productUrl)) {
    errors.productUrl = 'wishPool.validation.productUrlInvalid';
  }

  const imageValidation = validateImageFile(draft.imageFile);
  if (!imageValidation.valid) errors.imageFile = imageValidation.error;

  return errors;
}

export function getGroupBuyDecisionMeta(decision) {
  switch (decision) {
    case 'Pending':
      return { key: 'wishPool.decision.pending', variant: 'pending' };
    case 'Opened':
      return { key: 'wishPool.decision.opened', variant: 'opened' };
    case 'NotOpened':
      return { key: 'wishPool.decision.notOpened', variant: 'not-opened' };
    default:
      return { key: 'wishPool.decision.unknown', variant: 'unknown' };
  }
}

export function canToggleReaction(item, isPending = false) {
  return item?.canReact === true && !isPending;
}

export { MAX_ACTIVITY_NAME_LENGTH, MAX_PRODUCT_URL_LENGTH, MAX_IMAGE_SIZE };
