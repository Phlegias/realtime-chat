import { useState } from "react";
import api from "../api/api.js";

export default function CreateChannelForm({ currentUser, onCreated }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await api.post(
                "/channels",
                { name, ownerId: currentUser.id, isPrivate: false },
                { header: { Authorization: `Bearer ${token}` } }
            );

            onCreated(res.data);
            setName("");
            setError("");
        } catch (err) {
            console.error(`ERROR: can't create channel: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreate} className="create-channel-form">
            <input
                type="text"
                placeholder="New channel name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
            </button>
            {error && <p className="error">{error}</p>}
        </form>
    );
}