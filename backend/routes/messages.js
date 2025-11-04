import express from "express";
import { MessageController } from "../controllers/messageController.js";
const router = express.Router();

router.get("/:channelId", MessageController.getByChannel);

export default router;