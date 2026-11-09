import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const required = ["JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} must be configured.`);
}
if (process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith("replace-with")) {
  throw new Error("JWT_SECRET must contain at least 32 characters.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  cookieName: process.env.COOKIE_NAME ?? "omni_mall_token",
  cookieSecure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
};