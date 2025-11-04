import { useEffect, useState } from "react";
import connectSocket from "../socket/socket";
import ChannelList from "../components/ChannelList";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage({ currentUser }) {
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = connectSocket();
        setSocket(s);
        return () => s.disconnect();
    }, []);

    if (!currentUser) return <div>Loading...</div>;

    return (
        <div className="chat-page">
            <div className="sidebar">
                <h3>Welcome, {currentUser.username}</h3>
                <ChannelList onSelect={setSelectedChannel} />
            </div>
            <div className="main">
                <ChatWindow channel={selectedChannel} currentUser={currentUser} socket={socket} />
            </div>
        </div>
    );
}