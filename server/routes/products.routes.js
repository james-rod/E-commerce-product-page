import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deactivateProductController,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);
router.post("/", authenticate, adminOnly, createProductController);
router.put("/:id", authenticate, adminOnly, updateProductController);
router.delete("/:id", authenticate, adminOnly, deactivateProductController);

export default router;
