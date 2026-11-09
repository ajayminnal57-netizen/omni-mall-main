import app from "./app.js";
import { env } from "./config/env.js";

<<<<<<< HEAD
const server = app.listen(env.port, () => console.info(`Omni Mall API listening on port ${env.port}.`));
server.on("error", (error) => {
  console.error("Omni Mall API failed to listen:", error.message);
  process.exitCode = 1;
=======
const server = app.listen(env.port, "0.0.0.0", async () => {
  console.info(`Omni Mall API listening on port ${env.port}.`);

  try {
    await connectDatabase();
    console.info("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
>>>>>>> 77346cf80669f40e7cdd4994e406d12c62e56b63
});