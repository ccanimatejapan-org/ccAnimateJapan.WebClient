import { httpClient } from '@/shared/api/httpClient';

export async function getProducts(params = {}) {
  if (import.meta.env.DEV) {
    return Promise.resolve(createMockProducts());
  }

  return httpClient.get('/products', { params });
}

export async function getProductById(id) {
  if (import.meta.env.DEV) {
    return Promise.resolve(createMockProducts().find((product) => product.id === Number(id)));
  }

  return httpClient.get(`/products/${id}`);
}

export function createMockProducts() {
  return [
    {
      id: 1,
      name: 'Tokyo Figure Set',
      category: 'figure',
      price: 1680,
      stock: 12,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=900&q=80',
      description: 'Collector figure set with limited edition packaging.'
    },
    {
      id: 2,
      name: 'Sakura Acrylic Stand',
      category: 'goods',
      price: 520,
      stock: 34,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80',
      description: 'Desktop acrylic stand for seasonal display.'
    },
    {
      id: 3,
      name: 'Anime Art Book',
      category: 'book',
      price: 980,
      stock: 8,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
      description: 'Premium art collection with character sketches.'
    },
    {
      id: 4,
      name: 'Character Keychain',
      category: 'goods',
      price: 260,
      stock: 42,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
      description: 'Compact keychain with durable metal clasp.'
    }
  ];
}
