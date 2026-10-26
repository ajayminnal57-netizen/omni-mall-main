import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier.");
const quantity = z.number().int().min(1).max(100);
const address = z.strictObject({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  address: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(1).max(24),
});

export const registerSchema = z.object({ body: z.strictObject({
  username: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/),
  email: z.email().max(254),
  password: z.string().min(8).max(128),
}) });
export const loginSchema = z.object({ body: z.strictObject({
  identity: z.string().trim().min(3).max(254),
  password: z.string().min(1).max(128),
}) });
export const profileSchema = z.object({ body: z.strictObject({ username: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/) }) });
export const productListSchema = z.object({ query: z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(90).optional(),
  minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  sort: z.enum(["featured", "price-low", "price-high", "rating", "newest"]).optional(),
}).refine((query) => Number(query.page ?? 1) >= 1 && Number(query.limit ?? 100) >= 1 && Number(query.limit ?? 100) <= 100, "Invalid pagination.") });
export const idParamSchema = z.object({ params: z.object({ id: objectId }) });
export const cartSchema = z.object({ body: z.strictObject({
  items: z.array(z.strictObject({ productId: objectId, quantity })).max(100),
}) });
export const orderSchema = z.object({ body: z.strictObject({
  items: z.array(z.strictObject({ productId: objectId, quantity })).min(1).max(100),
  shippingAddress: address,
}) });
export const productBodySchema = z.object({ body: z.strictObject({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
  brand: z.string().trim().max(100).optional(),
  category: z.string().trim().min(1).max(90),
  price: z.number().finite().min(0).max(1000000),
  stock: z.number().int().min(0).max(1000000),
  thumbnail: z.url().max(2048),
  images: z.array(z.url().max(2048)).max(20).optional(),
  rating: z.number().min(0).max(5).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
}) });
export const productPatchSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.strictObject({
    title: z.string().trim().min(1).max(160).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    brand: z.string().trim().max(100).optional(),
    category: z.string().trim().min(1).max(90).optional(),
    price: z.number().finite().min(0).max(1000000).optional(),
    stock: z.number().int().min(0).max(1000000).optional(),
    thumbnail: z.url().max(2048).optional(),
    images: z.array(z.url().max(2048)).max(20).optional(),
    rating: z.number().min(0).max(5).optional(),
    discountPercentage: z.number().min(0).max(100).optional(),
  }).refine((body) => Object.keys(body).length > 0, "At least one product field is required."),
});
export const orderStatusSchema = z.object({ body: z.strictObject({ status: z.enum(["processing", "shipped", "delivered", "cancelled"]) }), params: z.object({ id: objectId }) });
export const categorySchema = z.object({ body: z.strictObject({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(90),
  description: z.string().trim().max(500).optional(),
}) });
export const categoryPatchSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.strictObject({
    name: z.string().trim().min(1).max(80).optional(),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(90).optional(),
    description: z.string().trim().max(500).optional(),
    isActive: z.boolean().optional(),
  }).refine((body) => Object.keys(body).length > 0, "At least one category field is required."),
});