import { MessageModel } from "../models/messageModel.js";

export const MessageController = {
    async getByChannel(req, res) {
        try {
            const { channelId } = req.params;
            const messages = await MessageModel.getMessagesByChannel(channelId);
            res.json(messages);
        } catch (err) {
            console.error(`ERROR: can't get any messages: ${err.message}`);
            res.status(500).json({ message: "Failed to get messages" });
        }
    }
};