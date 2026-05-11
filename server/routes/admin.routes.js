import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";
import { getAllUsersController } from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", authenticate, adminOnly, getAllUsersController);

export default router;
