import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

export const registerUser = async ({ username, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 12);
  return User.create({ username, email, passwordHash });
};

export const authenticateUser = async ({ identity, password }) => {
  const user = await User.findOne({
    $or: [{ email: identity.toLowerCase() }, { username: identity.toLowerCase() }],
  }).select("+passwordHash");

  if (!user || !user.isActive || !(await user.comparePassword(password))) {
    throw new AppError(401, "Invalid username/email or password.");
  }
  return user;
};