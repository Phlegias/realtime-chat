import { useState } from "react";

export default function MessageInput({ onSend }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="primary">Send</button>
        </form>
    );
}