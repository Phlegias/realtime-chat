import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export function useSocket() {
    const token = localStorage.getItem("token");
    const socket = useMemo(() => io("http://localhost:5000", {
        autoConnect: false,
        auth: { token }
    }), [token]);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => console.log("🔌 Socket connected"));
        socket.on("connect_error", (err) => console.error(`ERROR: can't connect socket: ${err.message}`));

        return () => {
            console.log("🔌 Socket disconnected");
            socket.disconnect();
        }
    }, [socket]);

    return socket;
}