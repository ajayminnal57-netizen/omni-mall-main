import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import { calculateOrderTotals } from "../utils/pricing.js";

export const createOrder = async (userId, { items, shippingAddress }) => {
  const requested = new Map();
  for (const item of items) requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity);
  const normalized = [...requested].map(([productId, quantity]) => ({ productId, quantity }));
  const products = await Product.find({ _id: { $in: normalized.map((item) => item.productId) }, isActive: true });
  let totals;
  try {
    totals = calculateOrderTotals(normalized, products);
  } catch (error) {
    if (error instanceof RangeError || error instanceof TypeError) {
      throw new AppError(400, error.message);
    }
    throw error;
  }
  const decremented = [];
  let order;

  try {
    for (const item of totals.items) {
      const product = await Product.findOneAndUpdate(
        { _id: item.product, isActive: true, stock: { $gte: item.quantity }, price: item.unitPriceCents / 100 },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
      if (!product) throw new AppError(409, "Stock changed while placing the order. Please review your cart.");
      decremented.push(item);
    }

    order = await Order.create({ user: userId, items: totals.items, shippingAddress, ...totals });
  } catch (error) {
    await Promise.all(decremented.map(({ product, quantity }) => (
      Product.updateOne({ _id: product }, { $inc: { stock: quantity } })
    )));
    throw error;
  }

  try {
    await Cart.updateOne({ user: userId }, { $set: { items: [] } });
  } catch (error) {
    console.error("Order was created but the saved cart could not be cleared:", error);
  }
  return order;
};

export const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, user: userId, status: "pending" },
    { $set: { status: "cancelled" } },
    { new: true },
  );
  if (!order) throw new AppError(404, "Pending order not found.");
  await Promise.all(order.items.map(({ product, quantity }) => (
    Product.updateOne({ _id: product }, { $inc: { stock: quantity } })
  )));
  return order;
};