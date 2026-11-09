import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import bcrypt from "bcryptjs";
import { createId, readStore, updateStore } from "../src/services/jsonStore.js";

process.env.JWT_SECRET ??= "test-secret-that-is-at-least-32-characters-long";
const { default: app } = await import("../src/app.js");

test("root endpoint confirms the API is working", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.equal(response.text, "api is working");
});

test("health endpoint returns the standard success envelope", async () => {
  const response = await request(app).get("/api/v1/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { success: true, data: { status: "ok" } });
});

test("protected commerce endpoints reject unauthenticated requests", async () => {
  const response = await request(app).get("/api/v1/orders");

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.message, "Authentication is required.");
});

test("invalid public input is rejected before reading the JSON data store", async () => {
  const response = await request(app).get("/api/v1/products?limit=101");

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.message, "Request validation failed.");
});

test("product and category endpoints serve the JSON catalog using the API response shape", async () => {
  const [productsResponse, categoriesResponse] = await Promise.all([
    request(app).get("/api/v1/products"),
    request(app).get("/api/v1/products/categories"),
  ]);

  assert.equal(productsResponse.status, 200);
  assert.equal(productsResponse.body.success, true);
  assert.equal(productsResponse.body.data.products[0].id, productsResponse.body.data.products[0]._id);
  assert.equal(typeof productsResponse.body.data.products[0].category, "string");
  assert.equal(typeof productsResponse.body.data.pagination.total, "number");
  assert.equal(categoriesResponse.status, 200);
  assert.equal(categoriesResponse.body.success, true);
  assert.ok(categoriesResponse.body.data.categories.length > 0);
});

test("JSON-backed accounts, carts, wishlists, and orders work without a database", async () => {
  const initialStore = structuredClone(readStore());
  const agent = request.agent(app);

  try {
    const registration = await agent.post("/api/v1/auth/register").send({
      username: "json-demo-customer",
      email: "json-demo-customer@example.test",
      password: "example-password-123",
    });
    assert.equal(registration.status, 201);
    assert.equal(registration.body.data.user.role, "customer");
    assert.equal("passwordHash" in registration.body.data.user, false);

    const productId = readStore().products[0]._id;
    const cartResponse = await agent.put("/api/v1/cart").send({
      items: [{ productId, quantity: 1 }],
    });
    assert.equal(cartResponse.status, 200);
    assert.equal(cartResponse.body.data.items[0].quantity, 1);

    const wishlistResponse = await agent.post(`/api/v1/wishlist/${productId}`);
    assert.equal(wishlistResponse.status, 201);
    assert.deepEqual(wishlistResponse.body.data.productIds, [productId]);

    const orderResponse = await agent.post("/api/v1/orders").send({
      items: [{ productId, quantity: 1 }],
      shippingAddress: {
        name: "JSON Demo",
        email: "json-demo-customer@example.test",
        address: "123 Sample Street",
        city: "Sample City",
        postalCode: "12345",
      },
    });
    assert.equal(orderResponse.status, 201);
    assert.equal(orderResponse.body.data.order.status, "pending");

    const cartAfterOrder = await agent.get("/api/v1/cart");
    assert.deepEqual(cartAfterOrder.body.data.items, []);
    const cancelResponse = await agent.post(`/api/v1/orders/${orderResponse.body.data.order._id}/cancel`);
    assert.equal(cancelResponse.status, 200);
    assert.equal(cancelResponse.body.data.order.status, "cancelled");
  } finally {
    updateStore((store) => {
      for (const key of Object.keys(store)) delete store[key];
      Object.assign(store, initialStore);
    });
  }
});

test("admin catalog endpoints read and update JSON-backed products and categories", async () => {
  const initialStore = structuredClone(readStore());
  const adminId = createId();
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash("admin-example-password", 4);
  updateStore((store) => store.users.push({
    _id: adminId,
    username: "json-demo-admin",
    email: "json-demo-admin@example.test",
    passwordHash,
    role: "admin",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }));
  const agent = request.agent(app);

  try {
    const login = await agent.post("/api/v1/auth/login").send({
      identity: "json-demo-admin",
      password: "admin-example-password",
    });
    assert.equal(login.status, 200);

    const categoryResponse = await agent.post("/api/v1/admin/categories").send({
      name: "Test Category",
      slug: "test-category",
      description: "Test data",
    });
    assert.equal(categoryResponse.status, 201);

    const productResponse = await agent.post("/api/v1/admin/products").send({
      title: "Test Product",
      description: "A test product for the JSON store.",
      category: "test-category",
      price: 12.5,
      stock: 5,
      thumbnail: "https://example.test/product.jpg",
    });
    assert.equal(productResponse.status, 201);
    const productId = productResponse.body.data.product.id;

    const updateResponse = await agent.patch(`/api/v1/admin/products/${productId}`).send({ price: 15 });
    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.body.data.product.price, 15);

    const categoryId = categoryResponse.body.data.category._id;
    const categoryUpdate = await agent.patch(`/api/v1/admin/categories/${categoryId}`).send({
      slug: "renamed-test-category",
    });
    assert.equal(categoryUpdate.status, 200);
    assert.equal(categoryUpdate.body.data.category.slug, "renamed-test-category");

    const archiveResponse = await agent.patch(`/api/v1/admin/products/${productId}/archive`);
    assert.equal(archiveResponse.status, 200);
  } finally {
    updateStore((store) => {
      for (const key of Object.keys(store)) delete store[key];
      Object.assign(store, initialStore);
    });
  }
});
