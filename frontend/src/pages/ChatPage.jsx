import { useState } from "react";
import ChannelList from "../components/ChannelList";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
    const [selectedChannel, setSelectedChannel] = useState(null);

    // temporary mock user
    const currentUser = {id: 1, username: "Alice"};

    return (
        <div className="chat-page">
            <div className="sidebar">
                <ChannelList onSelect={setSelectedChannel} />
            </div>
            <div className="main">
                <ChatWindow channel={selectedChannel} currentUser={currentUser} />
            </div>
        </div>
    );
}