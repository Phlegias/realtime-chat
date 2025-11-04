import { db } from "./db.js";

export const ChannelModel = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM realtime_chat.channels");
        return rows;
    },

    async create(name, ownerId, isPrivate = false) {
        const [result] = await db.query(
            "INSERT INTO realtime_chat.channels (name, owner_id, is_private) VALUES (?, ?, ?)",
            [name, ownerId, isPrivate]
        );
    },

    async getMembers(channelId) {
        const [rows] = await db.query(
            `SELECT users.id, users.username, users.avatar, channel_members.role
            FROM realtime_chat.channel_members
            JOIN realtime_chat.users ON users.id = channel_members.user_id
            WHERE channel_members.channel_id = ?`, 
            [channelId]
        );
        return rows;
    }
};