import { useState, useEffect } from "react";
import api from "../api/api.js";

export default function ChannelList({ onSelect  }) {
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        const loadChannels = async () => {
            const res = await api.get("/channels");
            setChannels(res.data);
        };
        loadChannels();
    }, []);

    return (
        <div className="channel-list">
            <h3>Channels</h3>
            <ul>
                {channels.map((ch) => (
                    <li key={ch.id} onClick={() => onSelect(ch)}>
                        #{ch.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}