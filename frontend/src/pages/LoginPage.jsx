import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            const userRes = await api.get("/auth/me", {
                headers: { Authorization: `Bearer ${res.data.token}` }
            });
            onLogin(userRes.data);
            navigate("/");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="auth-page">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
    
}