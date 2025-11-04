import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import api from "./api/api.js";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        api
            .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setUser(res.data))
            .catch(() => localStorage.removeItem("token"));
    }
  }, []);

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