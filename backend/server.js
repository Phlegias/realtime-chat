import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import channelsRouter from "./routes/channels.js";
import messagesRouter from "./routes/messages.js";
import { MessageModel } from "./models/messageModel.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/channels", channelsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/auth", authRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join_channel", (channelId) => {
    socket.join(`channel_${channelId}`);
    console.log(`📡 Joined channel ${channelId}`);
  });

  socket.on("send_message", async ({ channelId, senderId, text }) => {
    const messageId = await MessageModel.create(channelId, senderId, text);
    const newMessage = { id: messageId, channelId, senderId, text };
    io.to(`channel_${channelId}`).emit("new_message", newMessage);
    console.log("💬 Message sent:", text);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
