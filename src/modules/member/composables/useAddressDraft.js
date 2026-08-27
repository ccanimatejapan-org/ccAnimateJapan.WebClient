import { reactive } from 'vue';

function valuesOf(address, fallbackDeliveryTypeId = null) {
  return { deliveryTypeId: address?.deliveryTypeId ?? fallbackDeliveryTypeId, addressName: address?.addressName ?? '', address: address?.address ?? '', isDefault: address?.isDefault ?? false };
}

export function useAddressDraft(initialAddress = null, defaultDeliveryTypeId = null) {
  const form = reactive(valuesOf(initialAddress, defaultDeliveryTypeId));
  function setAddress(address, fallbackDeliveryTypeId = form.deliveryTypeId) { Object.assign(form, valuesOf(address, fallbackDeliveryTypeId)); }
  function toPayload() { return { deliveryTypeId: form.deliveryTypeId, addressName: form.addressName, address: form.address, isDefault: form.isDefault }; }
  function resetAfterSuccess() { const deliveryTypeId = form.deliveryTypeId; Object.assign(form, valuesOf(null, deliveryTypeId)); }
  return { form, setAddress, toPayload, resetAfterSuccess };
}
