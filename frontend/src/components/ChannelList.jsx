import { useState, useEffect } from "react";
import api from "../api/api.js";
import CreateChannelForm from "./createChannelsForm.jsx";

export default function ChannelList({ onSelect, currentUser }) {
    const [channels, setChannels] = useState([]);
    const [publicChannels, setPublicChannels] = useState([]);
    
    const loadChannels = async () => { 
        const res = await api.get(`/channels?userId=${currentUser.id}`);
        setChannels(res.data);
    };

    const loadPublic = async () => {
        const res = await api.get("/channels/public");
        setPublicChannels(res.data);
    };

    const joinChannel = async (id) => {
        await api.post(`/channels/${id}/join`, { userId: currentUser.id });
        loadChannels();
    }

    useEffect(() => {
        loadChannels();
        loadPublic();
    }, []);

    const handleChannelCreated = (newChannel) => {
        setChannels((prev) => [...prev, newChannel]);
    };

    return (
        <div className="channel-list">
            <h3>My Channels</h3>
            <ul>
                {channels.map((ch) => (
                    <li key={ch.id} onClick={() => onSelect(ch)}>
                        #{ch.name}
                    </li>
                ))}
            </ul>

            <h4>Create new channel</h4>
            <CreateChannelForm currentUser={currentUser} onCreated={handleChannelCreated} />

            <h4>Public Channels</h4>
            <ul>
                {publicChannels.map((ch) =>(
                    <li key={ch.id}>
                        #{ch.name}{" "}
                        {!channels.find((c) => c.id === ch.id) && (
                            <button onClick={() => joinChannel(ch.id)}>Join</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}