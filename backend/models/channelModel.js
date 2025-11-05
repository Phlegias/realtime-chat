import { db } from "./db.js";

export const ChannelModel = {
    async create(name, ownerId, isPrivate = false) {
        const [result] = await db.query(
            "INSERT INTO realtime_chat.channels (name, owner_id, is_private) VALUES (?, ?, ?)",
            [name, ownerId, isPrivate]
        );
        return result.insertId;
    },
    
    async getAllForUser(userId) {
        const [rows] = await db.query(
            `SELECT ch.* FROM 
            realtime_chat.channels ch
            JOIN realtime_chat.channel_members m ON m.channel_id = ch.id
            WHERE m.user_id = ?`,
            [userId]
        );
        return rows;
    },

    async getPublic() {
        const [rows] = await db.query(
            "SELECT * FROM channels WHERE is_private = 0"
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM realtime_chat.channels WHERE id = ?", [id]);
        return rows[0];
    },

    async delete(id) {
        const [rows] = db.query("SELECT * FROM realtime_chat.channels WHERE ID = ?", [id]);
    },
};