import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";
import { createId, readStore, updateStore } from "./jsonStore.js";

export const serializeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return { ...safeUser, id: String(user._id) };
};

export const registerUser = async ({ username, email, password }) => {
  const normalizedUsername = username.toLowerCase();
  const normalizedEmail = email.toLowerCase();
  if (readStore().users.some((user) => user.username === normalizedUsername || user.email === normalizedEmail)) {
    throw new AppError(409, "A user with that username or email already exists.");
  }

  const now = new Date().toISOString();
  const user = {
    _id: createId(),
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 12),
    role: "customer",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  updateStore((store) => {
    if (store.users.some((record) => record.username === normalizedUsername || record.email === normalizedEmail)) {
      throw new AppError(409, "A user with that username or email already exists.");
    }
    store.users.push(user);
  });
  return user;
};

export const authenticateUser = async ({ identity, password }) => {
  const normalizedIdentity = identity.toLowerCase();
  const user = readStore().users.find((item) => (
    item.email === normalizedIdentity || item.username === normalizedIdentity
  ));

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, "Invalid username/email or password.");
  }
  return user;
};

export const seedAdminFromEnvironment = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase() || "admin";
  if (Boolean(email) !== Boolean(password)) {
    throw new Error("Set both ADMIN_EMAIL and ADMIN_PASSWORD to create an admin account.");
  }
  if (!email) return false;
  if (password.length < 8) throw new Error("ADMIN_PASSWORD must contain at least 8 characters.");

  const existing = readStore().users.find((user) => user.email === email);
  if (existing) {
    if (existing.role !== "admin") {
      throw new Error("ADMIN_EMAIL already belongs to a non-admin account; choose another email.");
    }
    return false;
  }
  if (readStore().users.some((user) => user.username === username)) {
    throw new Error("ADMIN_USERNAME is already in use; choose another username.");
  }

  const now = new Date().toISOString();
  const user = {
    _id: createId(),
    username,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  updateStore((store) => store.users.push(user));
  return true;
};
