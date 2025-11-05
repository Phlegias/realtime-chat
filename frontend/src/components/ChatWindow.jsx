import { useEffect, useRef , useState } from "react";
import api from "../api/api.js";
import MessageInput from "./MessageInput.jsx"

export default function ChatWindow({ channel, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!channel) return;
        let isMounted = true;

        api.get(`/messages/${channel.id}`).then((res) => {
            if (isMounted) {
                setMessages(res.data)
                scrollToBottom();
            }
        });

        socket.emit("join_channel", channel.id);

        const handleReceive = (msg) => {
            if (msg.channel_id === channel.id) {
                setMessages((prev) => [...prev, msg]);
                scrollToBottom();
            }
        };

        socket.on("receive_message", handleReceive);

        return () => {
            isMounted = false;
            socket.emit("leave_channel", channel.id);
            socket.off("receive_message", handleReceive)
        };
    }, [channel?.id]);

    const handleSend = (content) => {
        if (!channel || !content.trim()) return;
        socket.emit("send_message", {
            channelId: channel.id,
            userId: currentUser.id,
            username: currentUser.username,
            avatar: currentUser.avatar,
            content
        });
    };

    if (!channel) return <div>Select a channel to start chatting</div>;

    return (
    <div className="chat-window">
      <h3>#{channel.name}</h3>
      <div className="messages">
        {messages.map((m) => {
          const isOwn = m.username === currentUser.username;
          return (
            <div
              key={m.id}
              className={`message ${isOwn ? "own-message" : ""}`}
            >
              <img
                className="avatar"
                src={m.avatar || "/default-avatar.png"}
                alt={m.username}
              />
              <div className="message-content">
                <div className="meta">
                  <strong>{m.username}</strong>{" "}
                  <span className="time">
                    {new Date(m.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text">{m.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
}