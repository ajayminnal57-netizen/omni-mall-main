import Category from "../models/Category.js";
import Product from "../models/Product.js";
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

const categoryForProduct = async (slug) => {
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) throw new AppError(400, "Select an existing active category.");
  return category._id;
};

export const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.validated.body, category: await categoryForProduct(req.validated.body.category) };
  const product = await Product.create(data);
  await product.populate("category", "slug");
  return sendSuccess(res, { product: serializeProduct(product) }, 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const changes = { ...req.validated.body };
  if (changes.category) changes.category = await categoryForProduct(changes.category);
  const product = await Product.findByIdAndUpdate(req.validated.params.id, changes, { new: true, runValidators: true }).populate("category", "slug");
  if (!product) throw new AppError(404, "Product not found.");
  return sendSuccess(res, { product: serializeProduct(product) });
});

export const deactivateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.validated.params.id, { isActive: false }, { new: true });
  if (!product) throw new AppError(404, "Product not found.");
  return sendSuccess(res, { message: "Product archived." });
});

export const createCategory = asyncHandler(async (req, res) => sendSuccess(
  res,
  { category: await Category.create(req.validated.body) },
  201,
));

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.validated.params.id, req.validated.body, { new: true, runValidators: true });
  if (!category) throw new AppError(404, "Category not found.");
  return sendSuccess(res, { category });
});