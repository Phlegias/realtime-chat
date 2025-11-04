import express from "express";
import { ChannelController } from "../controllers/channelController.js";
const router = express.Router();

router.get("/", ChannelController.getAll);
router.post("/", ChannelController.create);
router.get("/:id/members", ChannelController.getMembers);

export default router;