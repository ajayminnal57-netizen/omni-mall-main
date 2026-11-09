import { getCart, removeCartItem, saveCart } from "../services/cartService.js";
import { cancelOrder, createOrder } from "../services/orderService.js";
import { serializeProduct } from "../services/productService.js";
import { readStore, updateStore } from "../services/jsonStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/response.js";

export const readCart = asyncHandler(async (req, res) => sendSuccess(res, await getCart(req.user.id)));
export const writeCart = asyncHandler(async (req, res) => sendSuccess(res, await saveCart(req.user.id, req.validated.body.items)));
export const syncCart = asyncHandler(async (req, res) => sendSuccess(res, await saveCart(req.user.id, req.validated.body.items, true)));
export const deleteCartItem = asyncHandler(async (req, res) => sendSuccess(res, await removeCartItem(req.user.id, req.validated.params.id)));
export const clearUserCart = asyncHandler(async (req, res) => {
  updateStore((store) => {
    const cart = store.carts.find((item) => item.user === req.user.id);
    const now = new Date().toISOString();
    if (cart) {
      cart.items = [];
      cart.updatedAt = now;
    } else {
      store.carts.push({ user: req.user.id, items: [], createdAt: now, updatedAt: now });
    }
  });
  return sendSuccess(res, { items: [] });
});

export const readWishlist = asyncHandler(async (req, res) => {
  const { products, wishlists } = readStore();
  const wishlist = wishlists.find((item) => item.user === req.user.id);
  return sendSuccess(res, {
    products: (wishlist?.products ?? []).flatMap((id) => {
      const product = products.find((item) => item._id === id && item.isActive);
      return product ? [serializeProduct(product)] : [];
    }),
  });
});

export const addWishlistItem = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  if (!readStore().products.some((product) => product._id === id && product.isActive)) {
    throw new AppError(404, "Product not found.");
  }
  const wishlist = updateStore((store) => {
    let record = store.wishlists.find((item) => item.user === req.user.id);
    if (!record) {
      record = { user: req.user.id, products: [], createdAt: new Date().toISOString() };
      store.wishlists.push(record);
    }
    if (!record.products.includes(id)) record.products.push(id);
    record.updatedAt = new Date().toISOString();
    return record;
  });
  return sendSuccess(res, { productIds: wishlist.products.map(String) }, 201);
});

export const removeWishlistItem = asyncHandler(async (req, res) => {
  const productIds = updateStore((store) => {
    const wishlist = store.wishlists.find((item) => item.user === req.user.id);
    if (!wishlist) return [];
    wishlist.products = wishlist.products.filter((id) => id !== req.validated.params.id);
    wishlist.updatedAt = new Date().toISOString();
    return wishlist.products.map(String);
  });
  return sendSuccess(res, { productIds });
});

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.id, req.validated.body);
  return sendSuccess(res, { order }, 201);
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = readStore().orders
    .filter((order) => order.user === req.user.id)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  return sendSuccess(res, { orders });
});

export const getMyOrder = asyncHandler(async (req, res) => {
  const order = readStore().orders.find((item) => (
    item._id === req.validated.params.id && item.user === req.user.id
  ));
  if (!order) throw new AppError(404, "Order not found.");
  return sendSuccess(res, { order });
});

export const cancelMyOrder = asyncHandler(async (req, res) => sendSuccess(
  res,
  { order: await cancelOrder(req.user.id, req.validated.params.id) },
));

export const listAllOrders = asyncHandler(async (_req, res) => {
  const { orders, users } = readStore();
  const records = [...orders]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 250)
    .map((order) => {
      const user = users.find((item) => item._id === order.user);
      return { ...order, user: user ? { _id: user._id, username: user.username, email: user.email } : null };
    });
  return sendSuccess(res, { orders: records });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { status } = req.validated.body;
  const order = updateStore((store) => {
    const record = store.orders.find((item) => item._id === id);
    if (!record || ["cancelled", "delivered"].includes(record.status)) {
      throw new AppError(409, "Order not found or can no longer be changed.");
    }
    if (status === "cancelled") {
      const now = new Date().toISOString();
      for (const item of record.items) {
        const product = store.products.find((entry) => entry._id === String(item.product));
        if (product) {
          product.stock += item.quantity;
          product.updatedAt = now;
        }
      }
    }
    record.status = status;
    record.updatedAt = new Date().toISOString();
    return record;
  });
  return sendSuccess(res, { order });
});

export const adminSummary = asyncHandler(async (_req, res) => {
  const { products, users, orders } = readStore();
  return sendSuccess(res, {
    products: products.filter((product) => product.isActive).length,
    customers: users.filter((user) => user.role === "customer" && user.isActive).length,
    orders: orders.length,
    revenueCents: orders
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.totalCents, 0),
  });
});
