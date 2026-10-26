import { Router } from "express";
import { currentUser, login, logout, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, profileSchema, registerSchema } from "../validators/schemas.js";
import { rateLimit } from "express-rate-limit";

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, currentUser);
router.patch("/me", protect, validate(profileSchema), updateProfile);

export default router;