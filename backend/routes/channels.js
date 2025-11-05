import express from "express";
import { ChannelController } from "../controllers/channelController.js";
const router = express.Router();

router.post("/", ChannelController.create);
router.post("/:id/join", ChannelController.join);
router.get("/", ChannelController.getAllForUser);
router.get("/:id/members", ChannelController.getMembers);
router.get("/public", ChannelController.getPublic);
router.patch("/:id/members/:userId/role", ChannelController.updateRole);
router.delete("/:id/members/:userId", ChannelController.removeMember);

export default router;