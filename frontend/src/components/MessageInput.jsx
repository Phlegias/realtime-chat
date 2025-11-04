import { useState } from "react";
import socket from "../socket/socket";

export default function MessageInput({ channel, currentUser }) {
    const [text, setText] = useState("");

    const sendMessage = () => {
        if (!text.trim()) return;
        socket.emit("send_message", {
            channelId: channel.id,
            senderId: currentUser.id,
            text
        });
        setText("");
    };

    return (
        <div className="message-input">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}