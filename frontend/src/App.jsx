import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/api.js";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        api
            .get("/auth/me", { 
                headers: { Authorization: `Bearer ${token}` } 
            })
            .then((res) => setUser(res.data))
            .catch((err) => {
                console.warn(`Invalid token, clearing it: ${err}`);
                localStorage.removeItem("token");
            })
            .finally(() => setLoading(false));
    }, []);

    if(loading) {
        return <div className="loading-screen">Loading...</div>
    }

  return (
    <Router>
        <Routes>
            <Route
                path="/"
                element={user ? <ChatPage currentUser={user} /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<LoginPage onLogin={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    </Router>
  );
}