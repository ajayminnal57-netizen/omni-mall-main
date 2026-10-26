import { Router } from "express";
import { requireRole, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { categoryPatchSchema, categorySchema, idParamSchema, orderStatusSchema, productBodySchema, productPatchSchema } from "../validators/schemas.js";
import {
  createCategory,
  createProduct,
  deactivateProduct,
  updateCategory,
  updateProduct,
} from "../controllers/productController.js";
import { adminSummary, listAllOrders, updateOrderStatus } from "../controllers/commerceController.js";

const router = Router();
router.use(protect, requireRole("admin"));

router.get("/summary", adminSummary);
router.post("/products", validate(productBodySchema), createProduct);
router.patch("/products/:id", validate(productPatchSchema), updateProduct);
router.patch("/products/:id/archive", validate(idParamSchema), deactivateProduct);
router.post("/categories", validate(categorySchema), createCategory);
router.patch("/categories/:id", validate(categoryPatchSchema), updateCategory);
router.get("/orders", listAllOrders);
router.patch("/orders/:id/status", validate(orderStatusSchema), updateOrderStatus);

export default router;