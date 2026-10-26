import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

process.env.MONGODB_URI ??= "mongodb://127.0.0.1:27017/omni_mall_test";
process.env.JWT_SECRET ??= "test-secret-that-is-at-least-32-characters-long";
const { default: app } = await import("../src/app.js");

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

test("invalid public input is rejected before database access", async () => {
  const response = await request(app).get("/api/v1/products?limit=101");

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.message, "Request validation failed.");
});
