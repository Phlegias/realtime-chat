import { db } from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AuthController = {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const [existing] = await db.query("SELECT * FROM realtime_chat.users WHERE email = ?", [email]);
            if (existing.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashed = await bcrypt.hash(password, 10);
            const [result] = await db.query(
                "INSERT INTO realtime_chat.users (username, email, password_hash) VALUES (?, ?, ?)",
                [username, email, hashed]
            );

            const token = jwt.sign(
                { id: result.insertId, username: result.username},
                process.env.JWT_SECRET,
                {expiresIn: "7d"}
            );

            res.json({ token });
        } catch (err) {
            console.error(`ERROR IN REGISTER: ${err.message}`);
            res.status(500).json({ message: "Server error" });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const [rows] = await db.query("SELECT * FROM realtime_chat.users WHERE email = ?", [email]);
            if (rows.length === 0) return res.status(400).json({ message: "User not found" });

            const user = rows[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) return res.status(400).json({ message: "Invalid credentials" });

            const token = jwt.sign(
                { id: user.id, username: user.username},
                process.env.JWT_SECRET,
                {expiresIn: "7d"}
            );

            res.json({ token });
        } catch (err) {
            console.error(`ERROR IN LOGIN: ${err.message}`);
            res.status(500).json({ message: "Server error" });
        }
    },

    async me(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ message: "No token" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [rows] = await db.query("SELECT id, username, email, avatar FROM realtime_chat.users WHERE id = ?", [decoded.id]);
            res.json(rows[0]);
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    }
}