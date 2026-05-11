import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getCartController,
  upsertItemController,
  removeItemController,
  clearCartController,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authenticate, getCartController);
router.post("/item", authenticate, upsertItemController);
router.delete("/item/:productId", authenticate, removeItemController);
router.delete("/", authenticate, clearCartController);

export default router;
