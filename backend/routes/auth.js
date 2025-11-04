import express from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", authMiddleware, AuthController.register);
router.post("/login", authMiddleware, AuthController.login);
router.get("/me", authMiddleware, AuthController.me);

export default router;
