import test from "node:test";
import assert from "node:assert/strict";
import { loginSchema, orderSchema, productListSchema, registerSchema } from "../src/validators/schemas.js";

const request = (body = {}, params = {}, query = {}) => ({ body, params, query });

test("registration validates credentials and rejects role escalation fields", () => {
  const valid = registerSchema.safeParse(request({
    username: "home.user",
    email: "buyer@example.com",
    password: "long-enough-secret",
  }));
  const escalation = registerSchema.safeParse(request({
    username: "home.user",
    email: "buyer@example.com",
    password: "long-enough-secret",
    role: "admin",
  }));
  const weakPassword = registerSchema.safeParse(request({
    username: "home.user",
    email: "buyer@example.com",
    password: "short",
  }));

  assert.equal(valid.success, true);
  assert.equal(escalation.success, false);
  assert.equal(weakPassword.success, false);
});

test("login only accepts the identity/password contract", () => {
  assert.equal(loginSchema.safeParse(request({ identity: "buyer", password: "secret" })).success, true);
  assert.equal(loginSchema.safeParse(request({ identity: "buyer", password: "secret", role: "admin" })).success, false);
});

test("catalog filters and order quantities are bounded and typed", () => {
  assert.equal(productListSchema.safeParse(request({}, {}, { limit: "100", sort: "rating" })).success, true);
  assert.equal(productListSchema.safeParse(request({}, {}, { limit: "1000" })).success, false);
  assert.equal(orderSchema.safeParse(request({ items: [{ productId: "507f1f77bcf86cd799439011", quantity: 1 }], shippingAddress: {
    name: "Buyer",
    email: "buyer@example.com",
    address: "1 Main Street",
    city: "Toronto",
    postalCode: "A1A 1A1",
  } })).success, true);
  assert.equal(orderSchema.safeParse(request({ items: [{ productId: "507f1f77bcf86cd799439011", quantity: 1.5 }], shippingAddress: {
    name: "Buyer",
    email: "buyer@example.com",
    address: "1 Main Street",
    city: "Toronto",
    postalCode: "A1A 1A1",
  } })).success, false);
});
