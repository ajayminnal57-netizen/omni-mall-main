import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => console.info(`Omni Mall API listening on port ${env.port}.`));
server.on("error", (error) => {
  console.error("Omni Mall API failed to listen:", error.message);
  process.exitCode = 1;
});