import { useEffect, useState } from "react";
import socket from "../socket/socket.js";
import api from "../api/api.js";
import MessageInput from "./MessageInput.jsx"

export default function ChatWindow({ channel, currentUser }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!channel) return;

        const loadMessages = async () => {
            const res = await api.get(`/messages/${channel.id}`);
            setMessages(res.data);
        };

        loadMessages();
        socket.emit("join_channel", channel.id);

        socket.on("new_message", (msg) => {
            if (msg.channelId === channel.id) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => {
            socket.off("new_message");
        };
    }, [channel]);

    if (!channel) return <div>Select a channel to start chatting</div>

    return (
        <div className="chat-window">
            <h2>#{channel.name}</h2>
            <div className="messages">
                {messages.map((m) => (
                    <div key={m.id} className="message"> 
                    <strong>{m.username || "User"}:</strong> {m.text}
                </div>
                ))}
            </div>
            <MessageInput channel={channel} currentUser={currentUser} />
        </div>
    );
}