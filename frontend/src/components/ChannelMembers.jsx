import { useEffect, useState } from "react";
import api from "../api/api.js";

export default function ChannelMembers({ channel, socket }) {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (!channel || ! channel.id) {
            setMembers([]);
            return;
        }

        api.get(`/channels/${channel.id}/members`)
           .then((res) => setMembers(res.data))
           .catch((err) => console.error(`Failed to load members: ${err}`));

        const handleUpdate = (newMembers) => setMembers(newMembers);
        socket?.on("update_members", handleUpdate);
        return () => socket.off("update_members", handleUpdate);

    }, [channel?.id, socket]);

    if (!channel) return null;

    return (
        <div className="channel-members">
            <h4>Members</h4>
            <ul>
                {members.map((m) => (
                    <li key={m.id} className="member-item">
                        <img
                            src={m.avatar || "../../public/default-avatar.png"}
                            alt={m.username}
                        />
                        <div className="username">
                            {m.username}{" "}
                        {m.role === "owner" && <span className="owner-tag">owner</span>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}