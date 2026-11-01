import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, "0.0.0.0", async () => {
  console.info(`Omni Mall API listening on port ${env.port}.`);

  try {
    await connectDatabase();
    console.info("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
});