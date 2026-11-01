import { Router } from "express";
import { getCategories, getProduct, getProducts } from "../controllers/productController.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema, productListSchema } from "../validators/schemas.js";

const router = Router();
router.get("/categories", getCategories);
router.get("/", validate(productListSchema), getProducts);
router.get("/:id", validate(idParamSchema), getProduct);

export default router;




