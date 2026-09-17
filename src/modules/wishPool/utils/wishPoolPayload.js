export function buildWishPoolFormData(draft = {}) {
  const payload = new FormData();
  payload.append('AnimateTypeId', String(draft.animateTypeId ?? '').trim());
  payload.append('ActivityName', String(draft.activityName ?? '').trim());
  payload.append('ProductUrl', String(draft.productUrl ?? '').trim());
  if (draft.imageFile) payload.append('ImageFile', draft.imageFile);
  return payload;
}
