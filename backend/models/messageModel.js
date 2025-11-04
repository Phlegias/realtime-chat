import { db } from "./db.js";

export const MessageModel = {
    async create(channelId, senderId, text) {
        const [result] = await db.query(
            "INSERT INTO realtime_chat.messages (channel_id, sender_id, text) VALUES (?, ?, ?)", 
            [channelId, senderId, text]
        );
        return result.insertId;
    },

    async getChannel(channelId) {
        const [rows] = await db.query(
            `SELECT messages.*, users.username, users.avatar
            FROM realtime_chat.messages
            JOIN realtime_chat.users ON messages.sender_id = users.id
            WHERE messages.channel_id = ?
            ORDER BY messages.created_at ASC`, 
            [channelId]
        );
        return rows;
    }
};