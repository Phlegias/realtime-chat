import { ChannelModel } from "../models/channelModel.js";
import { MemberModel } from "../models/memberModel.js";

export const ChannelController = {
    async create(req, res) {
        try {
            const { name, ownerId, isPrivate } = req.body;
            const channelId = await ChannelModel.create(name, ownerId, isPrivate);
            await MemberModel.addUser(channelId, ownerId, "owner");
            res.json({id: channelId, name, owner_id: ownerId, is_private: isPrivate });
        } catch (err) {
            console.error(`ERROR: can't create channel: ${err}`);
            res.status(500).json({ message: " Failed to create channel" });
        }
    },
    
    async getAllForUser(req, res) {
        try {
            const { userId } = req.query;
            const channels = await ChannelModel.getAllForUser(userId);
            res.json(channels);
        } catch (err) {
            console.error(`ERROR: can't fetch channels: ${err.message}`);
            res.status(500).json({ message: " Failed to get channels" });
        }
    },

    async getPublic(req, res) {
        try {
            const channels = await ChannelModel.getPublic();
            res.json(channels);
        } catch (err) {
            console.error(`ERROR: can't fetch public channels: ${err.message}`);
            res.status(500).json({ message: " Failed to get public channels" });
        }
    },

    async getMembers(req, res) {
        try {
            const { id } = req.params;
            const members = await ChannelModel.getMembers(id);
            res.json(members);
        } catch (err) {
            console.error(`ERROR: can't fetch members: ${err.message}`);
            res.status(500).json({ message: " Failed to get members" });
        }
    },

    async updateRole(req, res) {
        try {
            const { id, userId } = req.params;
            const { role } = req.body;

            await MemberModel.updateRole(id, userId, role);
            res.json({ message: `role updated to ${role}` });
        } catch (err) {
            console.error(`ERROR: can't upadate user's role: ${err.message}`);
            res.status(500).json({ message: " Failed to update role" });
        }
    },

    async removeMember(req, res) {
        try {
            const { id, userId } = req.params;
            const requesterId = req.user.id;

            const channel = await ChannelModel.findById(id);
            if (!channel) return res.status(400).json({ message: "Channel not found" });

            if (channel.owner_id !== requesterId) {
                return res.status(403).json({ message: "You are not channel owner" });
            }

            await MemberModel.removeUser(id, userId);
            res.json({ message: "User removed successfully" });
        } catch (err) {
            console.error(`ERROR: can't remove user: ${err.message}`);
            res.status(500).json({ message: " Failed to remove user" });
        }
    },

    async join(req, res) {
        try {
            const { id } = req.params;
            const { userId} = req.body;

            const members = await MemberModel.getMembers(id);
            if (members.find((m) => m.id === Number(userId))) {
                return res.status(400).json({ message: "Already joined" });
            }
            await MemberModel.addUser(id, userId, "member");
            res.json({ message: "Joined successfully" });
        } catch (err) {
            console.error(`ERROR: can't join channel: ${err.message}`);
            res.status(500).json({ message: " Failed to join channel" });
        }
    }
};