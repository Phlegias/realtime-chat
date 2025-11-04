import { io } from "socket.io-client";

export default function connectSocket() {
    const token = localStorage.getItem("token");
    return io("http://localhost:5000", {
        auth: { token }
    });
}