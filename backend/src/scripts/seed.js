import "../config/env.js";
import { readStore } from "../services/jsonStore.js";
import { seedAdminFromEnvironment } from "../services/authService.js";

try {
  const adminCreated = await seedAdminFromEnvironment();
  const { categories, products } = readStore();
  console.info(`JSON data ready: ${products.length} products and ${categories.length} categories.`);
  if (adminCreated) console.info("Admin account created from environment credentials.");
  else if (!process.env.ADMIN_EMAIL) console.info("Admin account creation skipped; no admin credentials configured.");
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
}
