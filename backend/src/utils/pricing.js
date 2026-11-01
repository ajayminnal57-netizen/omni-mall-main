import { usdCentsToInrPaise } from "./currency.js";

export const SHIPPING_THRESHOLD_CENTS = usdCentsToInrPaise(10000);
export const SHIPPING_FEE_CENTS = usdCentsToInrPaise(895);
export const TAX_RATE = 0.08;

export const calculateOrderTotals = (items, products) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError("An order must contain at least one item.");
  }

  const productById = new Map(products.map((product) => [String(product._id), product]));
  const normalizedItems = items.map(({ productId, quantity }) => {
    const product = productById.get(String(productId));

    if (!product || !product.isActive) {
      throw new RangeError(`Product ${productId} is unavailable.`);
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
      throw new RangeError(`Invalid quantity for product ${productId}.`);
    }

    const unitPriceCents = Math.round(product.price * 100);
    return {
      product: product._id,
      title: product.title,
      image: product.thumbnail,
      quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * quantity,
    };
  });

  const subtotalCents = normalizedItems.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const shippingCents = subtotalCents >= SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;
  const taxCents = Math.round(subtotalCents * TAX_RATE);

  return {
    items: normalizedItems,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
  };
};
