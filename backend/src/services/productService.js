import Category from "../models/Category.js";
import Product from "../models/Product.js";

const productFields = "title description brand category price stock thumbnail images rating discountPercentage warrantyInformation shippingInformation availabilityStatus reviews isActive createdAt updatedAt";

export const serializeProduct = (product) => {
  const value = typeof product.toObject === "function" ? product.toObject() : product;
  return {
    ...value,
    id: String(value._id),
    category: value.category?.slug ?? value.category,
  };
};

export const listProducts = async (query) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 100);
  const filter = { isActive: true };
  if (query.category) {
    const category = await Category.findOne({ slug: query.category, isActive: true }).select("_id");
    if (!category) return { products: [], pagination: { page, limit, total: 0, pages: 0 } };
    filter.category = category._id;
  }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice !== undefined) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.q) filter.$text = { $search: query.q };

  const sortMap = {
    featured: { rating: -1, createdAt: -1 },
    "price-low": { price: 1 },
    "price-high": { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };
  const [records, total] = await Promise.all([
    Product.find(filter).select(productFields).populate("category", "slug").sort(sortMap[query.sort] ?? sortMap.featured).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: records.map(serializeProduct),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isActive: true }).select(productFields).populate("category", "slug").lean();
  return product ? serializeProduct(product) : null;
};

export const listCategories = () => Category.find({ isActive: true }).sort({ name: 1 }).lean();