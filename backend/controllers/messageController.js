import { MessageModel } from "../models/messageModel.js";

export const MessageController = {
    async getByChannel(req, res) {
        const { channelId } = req.params;
        const messages = await MessageModel.getChannel(channelId);
        res.json(messages);
    }
};