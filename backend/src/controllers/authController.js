import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { authenticateUser, registerUser, serializeUser } from "../services/authService.js";
import { clearAuthCookie, createToken, setAuthCookie } from "../middleware/auth.js";
import AppError from "../utils/AppError.js";
import { updateStore } from "../services/jsonStore.js";

const issueSession = (res, user, status = 200) => {
  setAuthCookie(res, createToken(user));
  return sendSuccess(res, { user: serializeUser(user) }, status);
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

export const currentUser = (req, res) => sendSuccess(res, { user: serializeUser(req.user) });

export const updateProfile = asyncHandler(async (req, res) => {
  const user = updateStore((store) => {
    const record = store.users.find((item) => item._id === req.user.id);
    if (!record) throw new AppError(401, "The session is no longer valid.");
    const username = req.validated.body.username.toLowerCase();
    if (store.users.some((item) => item._id !== record._id && item.username === username)) {
      throw new AppError(409, "A user with that username already exists.");
    }
    record.username = username;
    record.updatedAt = new Date().toISOString();
    return record;
  });
  return sendSuccess(res, { user: serializeUser(user) });
});

export const requireAuthenticatedIdentity = (req, _res, next) => {
  if (!req.user) return next(new AppError(401, "Authentication is required."));
  return next();
};