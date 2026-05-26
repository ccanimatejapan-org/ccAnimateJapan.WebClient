import { httpClient } from '@/shared/api/httpClient';

export async function getProfile() {
  if (import.meta.env.DEV) {
    return Promise.resolve({
      name: 'Demo Member',
      email: 'member@example.com',
      phone: '0912345678'
    });
  }

  return httpClient.get('/member/profile');
}

export async function updateProfile(payload) {
  if (import.meta.env.DEV) {
    return Promise.resolve(payload);
  }

  return httpClient.put('/member/profile', payload);
}

export async function getAddresses() {
  if (import.meta.env.DEV) {
    return Promise.resolve([
      {
        id: 1,
        name: 'Home',
        receiver: 'Demo Member',
        phone: '0912345678',
        address: 'Taipei City'
      }
    ]);
  }

  return httpClient.get('/member/addresses');
}
