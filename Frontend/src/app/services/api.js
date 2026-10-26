const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

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

export const fetchProducts = async (filters = {}) => {
  const query = new URLSearchParams({ limit: '100' });
  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value);
  }
  const data = await apiRequest(`/products?${query.toString()}`, { cache: 'no-store' });
  return data.products;
};

export const fetchProduct = async (id) => {
  const data = await apiRequest(`/products/${encodeURIComponent(id)}`, { cache: 'no-store' });
  return data.product;
};
