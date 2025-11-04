import { ChannelModel } from "../models/channelModel.js";
import { MemberModel } from "../models/memberModel.js";

export const ChannelController = {
    async getAll(req, res) {
        const channels = await ChannelModel.getAll();
        res.json(channels);
    },

    async create(req, res) {
        const { name, ownerId, isPrivate } = req.body;
        const channelId = await ChannelModel.create(name, ownerId, isPrivate);
        await MemberModel.addUser(channelId, ownerId, "owner");
        res.json({id: channelId, name });
    },

    async getMembers(req, res) {
        const { id } = req.params;
        const members = await ChannelModel.getMembers(id);
        res.json(members);
    }
};