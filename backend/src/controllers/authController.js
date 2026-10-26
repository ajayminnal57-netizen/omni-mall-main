import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { authenticateUser, registerUser } from "../services/authService.js";
import { clearAuthCookie, createToken, setAuthCookie } from "../middleware/auth.js";
import AppError from "../utils/AppError.js";

const issueSession = (res, user, status = 200) => {
  setAuthCookie(res, createToken(user));
  return sendSuccess(res, { user: user.toJSON() }, status);
};

export const register = asyncHandler(async (req, res) => issueSession(
  res,
  await registerUser(req.validated.body),
  201,
));

export const login = asyncHandler(async (req, res) => issueSession(
  res,
  await authenticateUser(req.validated.body),
));

export const logout = (_req, res) => {
  clearAuthCookie(res);
  return sendSuccess(res, { message: "Logged out." });
};

export const currentUser = (req, res) => sendSuccess(res, { user: req.user.toJSON() });

export const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  user.username = req.validated.body.username;
  await user.save();
  return sendSuccess(res, { user: user.toJSON() });
});

export const requireAuthenticatedIdentity = (req, _res, next) => {
  if (!req.user) return next(new AppError(401, "Authentication is required."));
  return next();
};