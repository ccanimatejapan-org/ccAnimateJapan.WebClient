import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

export async function getProfile() {
  const response = await httpClient.get('/member/profile');
  return unwrapApiResponse(response, 'member.loadFailed');
}

export async function updateProfile(payload) {
  const response = await httpClient.put('/member/profile', payload);
  return unwrapApiResponse(response, 'member.saveFailed');
}

export async function getAddresses() {
  const response = await httpClient.get('/member/addresses');
  return unwrapApiResponse(response, 'member.loadFailed');
}

export async function createAddress(payload) {
  const response = await httpClient.post('/member/addresses', payload);
  return unwrapApiResponse(response, 'member.saveFailed');
}

export async function updateAddress(id, payload) {
  const response = await httpClient.put(`/member/addresses/${id}`, payload);
  return unwrapApiResponse(response, 'member.saveFailed');
}

export async function deleteAddress(id) {
  const response = await httpClient.delete(`/member/addresses/${id}`);
  return unwrapApiResponse(response, 'member.deleteFailed');
}

export async function setDefaultAddress(id) {
  const response = await httpClient.post(`/member/addresses/${id}/default`);
  return unwrapApiResponse(response, 'member.saveFailed');
}

export async function getDeliveryTypes() {
  const response = await httpClient.get('/member/delivery-types');
  return unwrapApiResponse(response, 'member.loadFailed');
}
