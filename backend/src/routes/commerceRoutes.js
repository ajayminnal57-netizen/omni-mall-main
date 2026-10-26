import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { cartSchema, idParamSchema, orderSchema } from "../validators/schemas.js";
import {
  addWishlistItem,
  cancelMyOrder,
  clearUserCart,
  deleteCartItem,
  getMyOrder,
  listMyOrders,
  placeOrder,
  readCart,
  readWishlist,
  removeWishlistItem,
  syncCart,
  writeCart,
} from "../controllers/commerceController.js";

const router = Router();
router.use(protect);

router.get("/cart", readCart);
router.put("/cart", validate(cartSchema), writeCart);
router.post("/cart/sync", validate(cartSchema), syncCart);
router.delete("/cart", clearUserCart);
router.delete("/cart/items/:id", validate(idParamSchema), deleteCartItem);

router.get("/wishlist", readWishlist);
router.post("/wishlist/:id", validate(idParamSchema), addWishlistItem);
router.delete("/wishlist/:id", validate(idParamSchema), removeWishlistItem);

router.post("/orders", validate(orderSchema), placeOrder);
router.get("/orders", listMyOrders);
router.get("/orders/:id", validate(idParamSchema), getMyOrder);
router.post("/orders/:id/cancel", validate(idParamSchema), cancelMyOrder);

export default router;