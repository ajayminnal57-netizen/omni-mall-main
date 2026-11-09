import AppError from "../utils/AppError.js";
import { calculateOrderTotals } from "../utils/pricing.js";
import { createId, readStore, updateStore } from "./jsonStore.js";

export const createOrder = async (userId, { items, shippingAddress }) => {
  const requested = new Map();
  for (const item of items) requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity);
  const normalized = [...requested].map(([productId, quantity]) => ({ productId, quantity }));
  const { products } = readStore();
  let totals;
  try {
    totals = calculateOrderTotals(normalized, products.filter((product) => (
      normalized.some((item) => item.productId === product._id)
    )));
  } catch (error) {
    if (error instanceof RangeError || error instanceof TypeError) {
      throw new AppError(400, error.message);
    }
    throw error;
  }

  const now = new Date().toISOString();
  const order = {
    _id: createId(),
    user: userId,
    ...totals,
    shippingAddress,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  updateStore((store) => {
    for (const item of totals.items) {
      const product = store.products.find((record) => record._id === String(item.product));
      if (!product || !product.isActive || product.stock < item.quantity || Math.round(product.price * 100) !== item.unitPriceCents) {
        throw new AppError(409, "Stock changed while placing the order. Please review your cart.");
      }
      product.stock -= item.quantity;
      product.updatedAt = now;
    }
    store.orders.push(order);
    const cart = store.carts.find((item) => item.user === userId);
    if (cart) {
      cart.items = [];
      cart.updatedAt = now;
    }
  });
  return order;
};

export const cancelOrder = async (userId, orderId) => updateStore((store) => {
  const order = store.orders.find((item) => item._id === orderId && item.user === userId && item.status === "pending");
  if (!order) throw new AppError(404, "Pending order not found.");
  const now = new Date().toISOString();
  order.status = "cancelled";
  order.updatedAt = now;
  for (const item of order.items) {
    const product = store.products.find((record) => record._id === String(item.product));
    if (product) {
      product.stock += item.quantity;
      product.updatedAt = now;
    }
  }
  return order;
});
