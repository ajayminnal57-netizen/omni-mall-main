import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";
import { readStore } from "../services/jsonStore.js";

const tokenFromRequest = (req) => {
  const authorization = req.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  return req.cookies?.[env.cookieName];
};

export const protect = async (req, _res, next) => {
  const token = tokenFromRequest(req);
  if (!token) return next(new AppError(401, "Authentication is required."));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const record = readStore().users.find((item) => item._id === payload.sub);
    const user = record ? { ...record, id: record._id } : null;
    if (!user || !user.isActive) throw new AppError(401, "The session is no longer valid.");
    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    return next(new AppError(401, "The session is invalid or expired."));
  }
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError(403, "You do not have permission to perform this action."));
  }
  return next();
};

export const createToken = (user) => jwt.sign(
  { sub: user.id ?? user._id, role: user.role },
  env.jwtSecret,
  { expiresIn: env.jwtExpiresIn, algorithm: "HS256" },
);

export const setAuthCookie = (res, token) => res.cookie(env.cookieName, token, {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "strict",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const clearAuthCookie = (res) => res.clearCookie(env.cookieName, {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "strict",
  path: "/",
});