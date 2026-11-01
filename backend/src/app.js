import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commerceRoutes from "./routes/commerceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { sendSuccess } from "./utils/response.js";

const app = express();
const allowedOrigins = env.frontendOrigin.split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));

app.get("/api/v1/health", (_req, res) => sendSuccess(res, { status: "ok" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1", commerceRoutes);
app.use("/api/v1/admin", adminRoutes);
app.get("/", (_req, res) => {
  res.send("api is working");
});
app.use(notFound);
app.use(errorHandler);

export default app;