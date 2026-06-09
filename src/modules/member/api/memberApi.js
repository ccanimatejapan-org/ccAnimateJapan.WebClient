import { httpClient } from '@/shared/api/httpClient';

export async function getProfile() {
  return httpClient.get('/member/profile');
}

export async function updateProfile(payload) {
  return httpClient.put('/member/profile', payload);
}

export async function getAddresses() {
  return httpClient.get('/member/addresses');
}
