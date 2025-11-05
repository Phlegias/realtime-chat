import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import channelsRouter from "./routes/channels.js";
import messagesRouter from "./routes/messages.js";
import { MessageModel } from "./models/messageModel.js";
import authRouter from "./routes/auth.js";
import { create } from "domain";

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
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = user;
        next();
    } catch {
        next(new Error("Invalid token"));
    }
});


io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("join_channel", (channelId) => {
        socket.join(`channel_${channelId}`);
        console.log(`📡 joined channel ${channelId}`);
    });

    socket.on("leave_channel", (channelId) => {
        socket.leave(`channel_${channelId}`);
        console.log(`🚪 left channel ${channelId}`)
    })

    socket.on("send_message", async ({ channelId, userId, username, content }) => {
        try {
            const messageId = await MessageModel.addMessage(channelId, userId, content);
            const messageData = { 
                id: messageId, 
                channel_id: channelId, 
                username, 
                content,
                created_at:new Date() 
            };

            io.to(`channel_${channelId}`).emit("receive_message", messageData);
            //todo: delete
            console.log("💬 Message sent:", content);
        } catch (err) {
            console.error(`ERROR: can't send a mesage ${err.message}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
