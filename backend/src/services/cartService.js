import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";

export const serializeCart = (cart) => ({
  items: cart.items.filter((item) => item.product).map(({ product, quantity }) => ({
    ...product.toObject(),
    id: String(product._id),
    category: product.category?.slug ?? product.category,
    quantity,
  })),
});

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    populate: { path: "category", select: "slug" },
  });
  return cart ? serializeCart(cart) : { items: [] };
};

export const saveCart = async (userId, requestedItems, merge = false) => {
  const unique = new Map();
  for (const item of requestedItems) unique.set(item.productId, (unique.get(item.productId) ?? 0) + item.quantity);
  const productIds = [...unique.keys()];
  const products = await Product.find({ _id: { $in: productIds }, isActive: true }).select("_id stock").lean();
  const productsById = new Map(products.map((product) => [String(product._id), product]));
  const existing = merge ? await Cart.findOne({ user: userId }) : null;
  const quantities = new Map((existing?.items ?? []).map((item) => [String(item.product), item.quantity]));

  for (const [productId, quantity] of unique) {
    const product = productsById.get(productId);
    if (!product && merge) continue;
    if (!product) throw new AppError(404, "One or more products are unavailable.");
    const total = quantity + (merge ? quantities.get(productId) ?? 0 : 0);
    if (total > product.stock) throw new AppError(400, "Cart quantity exceeds available stock.");
    quantities.set(productId, total);
  }

  const items = [...quantities.entries()].filter(([, quantity]) => quantity > 0).map(([product, quantity]) => ({ product, quantity }));
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { items }, $setOnInsert: { user: userId } },
    { new: true, upsert: true, runValidators: true },
  );
  return getCart(cart.user);
};

export const removeCartItem = async (userId, productId) => {
  await Cart.updateOne({ user: userId }, { $pull: { items: { product: productId } } });
  return getCart(userId);
};