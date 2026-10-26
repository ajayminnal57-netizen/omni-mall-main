import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import { saveCart, getCart, removeCartItem } from "../services/cartService.js";
import { cancelOrder, createOrder } from "../services/orderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/response.js";

export const readCart = asyncHandler(async (req, res) => sendSuccess(res, await getCart(req.user.id)));
export const writeCart = asyncHandler(async (req, res) => sendSuccess(res, await saveCart(req.user.id, req.validated.body.items)));
export const syncCart = asyncHandler(async (req, res) => sendSuccess(res, await saveCart(req.user.id, req.validated.body.items, true)));
export const deleteCartItem = asyncHandler(async (req, res) => sendSuccess(res, await removeCartItem(req.user.id, req.validated.params.id)));
export const clearUserCart = asyncHandler(async (req, res) => {
  await Cart.updateOne({ user: req.user.id }, { $set: { items: [] } }, { upsert: true, setDefaultsOnInsert: true });
  return sendSuccess(res, { items: [] });
});

export const readWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id }).populate({ path: "products", match: { isActive: true }, populate: { path: "category", select: "slug" } });
  return sendSuccess(res, { products: (wishlist?.products ?? []).map((product) => ({ ...product.toObject(), id: String(product._id), category: product.category?.slug })) });
});

export const addWishlistItem = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.validated.params.id, isActive: true }).select("_id");
  if (!product) throw new AppError(404, "Product not found.");
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user.id },
    { $addToSet: { products: product._id }, $setOnInsert: { user: req.user.id } },
    { new: true, upsert: true },
  );
  return sendSuccess(res, { productIds: wishlist.products.map(String) }, 201);
});

export const removeWishlistItem = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate({ user: req.user.id }, { $pull: { products: req.validated.params.id } }, { new: true });
  return sendSuccess(res, { productIds: (wishlist?.products ?? []).map(String) });
});

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.id, req.validated.body);
  return sendSuccess(res, { order }, 201);
});

export const listMyOrders = asyncHandler(async (req, res) => sendSuccess(
  res,
  { orders: await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).lean() },
));

export const getMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.validated.params.id, user: req.user.id }).lean();
  if (!order) throw new AppError(404, "Order not found.");
  return sendSuccess(res, { order });
});

export const cancelMyOrder = asyncHandler(async (req, res) => sendSuccess(
  res,
  { order: await cancelOrder(req.user.id, req.validated.params.id) },
));

export const listAllOrders = asyncHandler(async (_req, res) => sendSuccess(
  res,
  { orders: await Order.find().populate("user", "username email").sort({ createdAt: -1 }).limit(250).lean() },
));

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.validated.body;
  const order = await Order.findOneAndUpdate(
    { _id: req.validated.params.id, status: { $nin: ["cancelled", "delivered"] } },
    { $set: { status } },
    { new: true },
  );
  if (!order) throw new AppError(409, "Order not found or can no longer be changed.");
  if (status === "cancelled") {
    await Promise.all(order.items.map(({ product, quantity }) => Product.updateOne({ _id: product }, { $inc: { stock: quantity } })));
  }
  return sendSuccess(res, { order });
});

export const adminSummary = asyncHandler(async (_req, res) => {
  const [products, customers, orders, revenue] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    (await import("../models/User.js")).default.countDocuments({ role: "customer", isActive: true }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, totalCents: { $sum: "$totalCents" } } }]),
  ]);
  return sendSuccess(res, { products, customers, orders, revenueCents: revenue[0]?.totalCents ?? 0 });
});