import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../socket/useSocket.js";
import ChannelList from "../components/ChannelList";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage({ currentUser }) {
     const socket = useSocket();
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();
   

    useEffect(() => {
        socket.connect();
        
        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.disconnect();
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    };

    return (
        <div className="chat-page">
            <div className="sidebar">
                <div className="user-info">
                    <h3>Welcome, {currentUser.username}</h3>
                    <button onClick={handleLogout}>Logout</button>
                </div>
                <ChannelList 
                currentUser={currentUser} 
                onSelect={setSelectedChannel} />
            </div>
            <div className="main">
                <ChatWindow 
                channel={selectedChannel} 
                currentUser={currentUser} 
                socket={socket} />
            </div>
        </div>
    );
}