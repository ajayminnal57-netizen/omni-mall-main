import { createId, readStore, updateStore } from "../services/jsonStore.js";
import { getProductById, listCategories, listProducts, serializeProduct } from "../services/productService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/response.js";

export const getProducts = asyncHandler(async (req, res) => sendSuccess(res, await listProducts(req.validated.query)));
export const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.validated.params.id);
  if (!product) throw new AppError(404, "Product not found.");
  return sendSuccess(res, { product });
});
export const getCategories = asyncHandler(async (_req, res) => sendSuccess(res, { categories: await listCategories() }));

const categoryForProduct = (slug, categories) => {
  const category = categories.find((item) => item.slug === slug && item.isActive);
  if (!category) throw new AppError(400, "Select an existing active category.");
  return category.slug;
};

export const createProduct = asyncHandler(async (req, res) => {
  const store = readStore();
  const product = {
    _id: createId(),
    ...req.validated.body,
    category: categoryForProduct(req.validated.body.category, store.categories),
    brand: req.validated.body.brand ?? "",
    images: req.validated.body.images ?? [],
    rating: req.validated.body.rating ?? 0,
    discountPercentage: req.validated.body.discountPercentage ?? 0,
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: req.validated.body.stock > 0 ? "In Stock" : "Out of Stock",
    reviews: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  updateStore((next) => next.products.push(product));
  return sendSuccess(res, { product: serializeProduct(product) }, 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const changes = { ...req.validated.body };
  updateStore((store) => {
    const product = store.products.find((item) => item._id === id);
    if (!product) throw new AppError(404, "Product not found.");
    if (changes.category) changes.category = categoryForProduct(changes.category, store.categories);
    Object.assign(product, changes, { updatedAt: new Date().toISOString() });
  });
  const product = readStore().products.find((item) => item._id === id);
  return sendSuccess(res, { product: serializeProduct(product) });
});

export const deactivateProduct = asyncHandler(async (req, res) => {
  updateStore((store) => {
    const product = store.products.find((item) => item._id === req.validated.params.id);
    if (!product) throw new AppError(404, "Product not found.");
    product.isActive = false;
    product.updatedAt = new Date().toISOString();
  });
  return sendSuccess(res, { message: "Product archived." });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description = "" } = req.validated.body;
  const category = {
    _id: createId(),
    name,
    slug,
    description,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  updateStore((store) => {
    if (store.categories.some((item) => item.slug === slug)) {
      throw new AppError(409, "A category with that slug already exists.");
    }
    store.categories.push(category);
  });
  return sendSuccess(res, { category }, 201);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { slug, ...changes } = req.validated.body;
  updateStore((store) => {
    const category = store.categories.find((item) => item._id === id);
    if (!category) throw new AppError(404, "Category not found.");
    if (slug && store.categories.some((item) => item._id !== id && item.slug === slug)) {
      throw new AppError(409, "A category with that slug already exists.");
    }
    const previousSlug = category.slug;
    Object.assign(category, changes, {
      ...(slug ? { slug } : {}),
      updatedAt: new Date().toISOString(),
    });
    if (slug && slug !== previousSlug) {
      for (const product of store.products) {
        if (product.category === previousSlug) product.category = slug;
      }
    }
  });
  const category = readStore().categories.find((item) => item._id === id);
  return sendSuccess(res, { category });
});
