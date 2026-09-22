import { Router } from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUser,
} from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Read-only team list accessible to ALL authenticated members
router.get("/", getAllUsers);

// Admin-only actions: change role, delete account, create member
router.post("/", requireAdmin, createUser);
router.patch("/:id/role", requireAdmin, updateUserRole);
router.delete("/:id", requireAdmin, deleteUser);

export default router;
