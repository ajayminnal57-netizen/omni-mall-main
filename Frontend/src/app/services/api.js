const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const PRODUCT_API_URL = 'https://dummyjson.com/products';

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message || 'The request could not be completed.');
  }
  return payload.data;
};

const normalizeProduct = (product) => ({
  ...product,
  id: String(product.id),
  _id: String(product.id),
  brand: product.brand ?? '',
  images: product.images?.length ? product.images : [product.thumbnail].filter(Boolean),
  reviews: product.reviews ?? [],
  warrantyInformation: product.warrantyInformation ?? '',
  shippingInformation: product.shippingInformation ?? '',
  availabilityStatus: product.availabilityStatus ?? (product.stock > 0 ? 'In Stock' : 'Out of Stock'),
});

export const fetchProducts = async () => {
  const response = await fetch(`${PRODUCT_API_URL}?limit=0`, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Unable to load products from DummyJSON (HTTP ${response.status}).`);
  }
  const payload = await response.json();
  if (!Array.isArray(payload.products)) {
    throw new Error('DummyJSON returned an invalid product catalog.');
  }
  return payload.products.map(normalizeProduct);
};

export const fetchManageableProducts = async () => {
  const data = await apiRequest('/products?limit=100', { cache: 'no-store' });
  return data.products;
};

export const fetchProduct = async (id) => {
  const response = await fetch(`${PRODUCT_API_URL}/${encodeURIComponent(id)}`, { next: { revalidate: 300 } });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Unable to load product from DummyJSON (HTTP ${response.status}).`);
  }
  const product = await response.json();
  if (!product || typeof product !== 'object' || !product.id) {
    throw new Error('DummyJSON returned an invalid product.');
  }
  return normalizeProduct(product);
};
