import test from "node:test";
import assert from "node:assert/strict";
import { calculateOrderTotals } from "../src/utils/pricing.js";

const product = {
  _id: "product-1",
  title: "Oak side table",
  thumbnail: "/table.jpg",
  price: 49.99,
  stock: 3,
  isActive: true,
};

test("calculates authoritative totals from JSON catalog product prices", () => {
  const totals = calculateOrderTotals(
    [{ productId: "product-1", quantity: 2 }],
    [product],
  );

  assert.equal(totals.subtotalCents, 9998);
  assert.equal(totals.shippingCents, 895);
  assert.equal(totals.taxCents, 800);
  assert.equal(totals.totalCents, 11693);
  assert.equal(totals.items[0].unitPriceCents, 4999);
});

test("rejects empty orders, unknown products, and quantities beyond stock", () => {
  assert.throws(() => calculateOrderTotals([], [product]), /at least one item/);
  assert.throws(
    () => calculateOrderTotals([{ productId: "missing", quantity: 1 }], [product]),
    /unavailable/,
  );
  assert.throws(
    () => calculateOrderTotals([{ productId: "product-1", quantity: 4 }], [product]),
    /Invalid quantity/,
  );
});

test("waives shipping when subtotal reaches the configured threshold", () => {
  const totals = calculateOrderTotals(
    [{ productId: "product-1", quantity: 3 }],
    [product],
  );

  assert.equal(totals.shippingCents, 0);
  assert.equal(totals.subtotalCents, 14997);
});
