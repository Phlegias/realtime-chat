import { db } from "./db.js";

export const MemberModel = {
    async addUser(channelId, userId, role = "member") {
        await db.query(
            "INSERT INTO realtime_chat.channel_members (channel_id, user_id, role) VALUES (?, ?, ?)",
            [channelId, userId, role]
        );
    },

    async removeUser(channelId, userId) {
        await db.query(
            "DELETE FROM realtime_chat.channel_members WHERE channel_id = ? AND user_id = ?",
            [channelId, userId]
        );
    },

    async getUserChannels(userId) {
        const [rows] = await db.query(
            `SELECT channels.*
            FROM realtime_chat.channels
            JOIN realtime_chat.channel_members ON channels.id = channel_members.channel_id
            WHERE channel_members.user_id = ?`,
            [userId]
        );
        return rows;
    },

    async updateRole(channelId, userId, role) {
        await db.query(
            "UPDATE realtime_chat.channel_members SET role = ? WHERE channel_id = ? AND user_id = ?",
            [role, channelId, userId]
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
    },

    async isMember(channelId, userId) {
        const [rows] = await db.query(
            "SELECT 1 FROM channel_members WHERE channel_id = ? AND user_id = ? LIMIT 1",
            [channelId, userId]
        );
        return rows.length > 0;
    }
};