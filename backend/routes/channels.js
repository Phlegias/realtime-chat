import express from "express";
import { ChannelController } from "../controllers/channelController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, ChannelController.getAll);
router.post("/", authMiddleware, ChannelController.create);
router.get("/:id/members", authMiddleware, ChannelController.getMembers);

export default router;