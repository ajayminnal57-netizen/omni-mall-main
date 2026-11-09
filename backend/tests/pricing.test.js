import test from "node:test";
import assert from "node:assert/strict";
import { calculateOrderTotals } from "../src/utils/pricing.js";
import {
  indiaMarketPriceFromInr,
  indiaMarketPriceFromUsd,
  restoreInrFromLegacyMarketEstimate,
  usdCentsToInrPaise,
  usdToInr,
} from "../src/utils/currency.js";

const product = {
  _id: "product-1",
  title: "Oak side table",
  thumbnail: "/table.jpg",
  price: indiaMarketPriceFromUsd(49.99, "furniture"),
  stock: 3,
  isActive: true,
};

<<<<<<< HEAD
test("calculates authoritative totals from JSON catalog product prices", () => {
=======
test("converts source dollar prices to INR and paise at the configured reference rate", () => {
  assert.equal(usdToInr(49.99), 4762.5);
  assert.equal(usdCentsToInrPaise(10000), 952691);
});

test("applies category-based India-market estimates after currency conversion", () => {
  assert.equal(indiaMarketPriceFromUsd(49.99, "furniture"), 3571.88);
  assert.equal(indiaMarketPriceFromInr(1000, "beauty"), 450);
  assert.throws(() => indiaMarketPriceFromUsd(10, "unknown"), /No India-market pricing factor/);
  assert.throws(() => indiaMarketPriceFromInr(-1, "beauty"), /non-negative finite number/);
});

test("restores INR values from legacy category-adjusted prices when migrating", () => {
  assert.equal(restoreInrFromLegacyMarketEstimate(2150, "beauty"), 4777.78);
  assert.throws(() => restoreInrFromLegacyMarketEstimate(10, "unknown"), /No India-market pricing factor/);
  assert.throws(() => restoreInrFromLegacyMarketEstimate(-1, "beauty"), /non-negative finite number/);
});

test("calculates authoritative totals from database product prices", () => {
>>>>>>> 77346cf80669f40e7cdd4994e406d12c62e56b63
  const totals = calculateOrderTotals(
    [{ productId: "product-1", quantity: 2 }],
    [product],
  );

  assert.equal(totals.subtotalCents, 714376);
  assert.equal(totals.shippingCents, 85266);
  assert.equal(totals.taxCents, 57150);
  assert.equal(totals.totalCents, 856792);
  assert.equal(totals.items[0].unitPriceCents, 357188);
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
  assert.equal(totals.subtotalCents, 1071564);
});
