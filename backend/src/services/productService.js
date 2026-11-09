import { readStore } from "./jsonStore.js";

const compareNewest = (left, right) => new Date(right.createdAt) - new Date(left.createdAt);

export const serializeProduct = (product) => ({
  ...product,
  id: String(product._id),
});

export const listProducts = async (query) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 100);
  const { categories, products } = readStore();
  const category = query.category
    ? categories.find((item) => item.slug === query.category && item.isActive)
    : null;

  if (query.category && !category) {
    return { products: [], pagination: { page, limit, total: 0, pages: 0 } };
  }

  const search = query.q?.toLocaleLowerCase();
  const filtered = products.filter((product) => (
    product.isActive
    && (!category || product.category === category.slug)
    && (query.minPrice === undefined || product.price >= Number(query.minPrice))
    && (query.maxPrice === undefined || product.price <= Number(query.maxPrice))
    && (!search || [product.title, product.description, product.brand]
      .some((value) => value.toLocaleLowerCase().includes(search)))
  ));

  const comparators = {
    featured: (left, right) => right.rating - left.rating || compareNewest(left, right),
    "price-low": (left, right) => left.price - right.price,
    "price-high": (left, right) => right.price - left.price,
    rating: (left, right) => right.rating - left.rating,
    newest: compareNewest,
  };
  filtered.sort(comparators[query.sort] ?? comparators.featured);
  const start = (page - 1) * limit;
  const records = filtered.slice(start, start + limit);

  return {
    products: records.map(serializeProduct),
    pagination: { page, limit, total: filtered.length, pages: Math.ceil(filtered.length / limit) },
  };
};

export const getProductById = async (id) => {
  const product = readStore().products.find((item) => item._id === id && item.isActive);
  return product ? serializeProduct(product) : null;
};

export const listCategories = async () => readStore().categories
  .filter((category) => category.isActive)
  .toSorted((left, right) => left.name.localeCompare(right.name));
