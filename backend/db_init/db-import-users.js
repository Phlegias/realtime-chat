import fs from "fs";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// clearing "users" table
await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
await connection.execute("TRUNCATE TABLE users");
await connection.execute("SET FOREIGN_KEY_CHECKS = 1");


const data = JSON.parse(fs.readFileSync("./users.json", "utf8"));

for (const u of data) {
  const username = u.username || u.name || "unknown";
  const email = u.email || `${username.toLowerCase()}@example.com`;
  const avatar = u.avatar || "/avatars/default.png";

  // set password for users
  const password = "123456";
  const hash = await bcrypt.hash(password, 10);

  try {
    await connection.execute(
      "INSERT INTO users (username, email, password_hash, avatar) VALUES (?, ?, ?, ?)",
      [username, email, hash, avatar]
    );
    console.log(`Added: ${username}`);
  } catch (err) {
    console.error(`ERROR: can't add: ${username}:`, err.message);
  }
}

await connection.end();
console.log("import complete!");
