import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import connectSocket from "../socket/socket";
import ChannelList from "../components/ChannelList";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage({ currentUser }) {
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const s = connectSocket();
        setSocket(s);
        return () => s.disconnect();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="chat-page">
            <div className="sidebar">
                <h3>Welcome, {currentUser.username}</h3>
                <button onClick={handleLogout}>Logout</button>
                <ChannelList onSelect={setSelectedChannel} />
            </div>
            <div className="main">
                <ChatWindow channel={selectedChannel} currentUser={currentUser} socket={socket} />
            </div>
        </div>
    );
}