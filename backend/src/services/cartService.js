import AppError from "../utils/AppError.js";
import { readStore, updateStore } from "./jsonStore.js";
import { serializeProduct } from "./productService.js";

export const getCart = async (userId) => {
  const { carts, products } = readStore();
  const cart = carts.find((item) => item.user === userId);
  if (!cart) return { items: [] };

  return {
    items: cart.items.flatMap(({ product: productId, quantity }) => {
      const product = products.find((item) => item._id === productId);
      return product ? [{ ...serializeProduct(product), quantity }] : [];
    }),
  };
};

export const saveCart = async (userId, requestedItems, merge = false) => {
  const { carts, products } = readStore();
  const unique = new Map();
  for (const item of requestedItems) unique.set(item.productId, (unique.get(item.productId) ?? 0) + item.quantity);
  const existing = merge ? carts.find((cart) => cart.user === userId) : null;
  const quantities = new Map((existing?.items ?? []).map((item) => [item.product, item.quantity]));

  for (const [productId, quantity] of unique) {
    const product = products.find((item) => item._id === productId && item.isActive);
    if (!product && merge) continue;
    if (!product) throw new AppError(404, "One or more products are unavailable.");
    const total = quantity + (merge ? quantities.get(productId) ?? 0 : 0);
    if (total > product.stock) throw new AppError(400, "Cart quantity exceeds available stock.");
    quantities.set(productId, total);
  }

  const items = [...quantities.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([product, quantity]) => ({ product, quantity }));
  updateStore((store) => {
    const cart = store.carts.find((item) => item.user === userId);
    if (cart) {
      cart.items = items;
      cart.updatedAt = new Date().toISOString();
    } else {
      store.carts.push({ user: userId, items, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
  });
  return getCart(userId);
};

export const removeCartItem = async (userId, productId) => {
  updateStore((store) => {
    const cart = store.carts.find((item) => item.user === userId);
    if (cart) {
      cart.items = cart.items.filter((item) => item.product !== productId);
      cart.updatedAt = new Date().toISOString();
    }
  });
  return getCart(userId);
};
