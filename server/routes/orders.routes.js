import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";
import {
  placeOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
} from "../controllers/orders.controller.js";

const router = Router();

router.post("/", authenticate, placeOrderController);
router.get("/", authenticate, getOrdersController);
router.get("/:id", authenticate, getOrderByIdController);
router.put("/:id/status", authenticate, adminOnly, updateOrderStatusController);

export default router;
