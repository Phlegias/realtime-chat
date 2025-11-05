import { db } from "./db.js";

export const MessageModel = {
    async addMessage(channelId, userId, content) {
        const [result] = await db.query(
            "INSERT INTO realtime_chat.messages (channel_id, user_id, content) VALUES (?, ?, ?)", 
            [channelId, userId, content]
        );
        return result.insertId;
    },

    async getMessagesByChannel(channelId) {
        const [rows] = await db.query(
            `SELECT m.id, m.content, m.created_at, u.username
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.channel_id = ?
            ORDER BY m.created_at ASC`,
            [channelId]
        );
        return rows;
    }
};