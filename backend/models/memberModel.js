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
  }
};