import bcrypt from "bcryptjs";
import { db } from "../config/db.js"; // Adjust this import according to your project structure
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const SECRET_KEY = process.env.SECRET_KEY;

export const registerUser = async (req, res) => {
  const { user, pwd } = req.body; // 'user' and 'pwd' are correctly destructured

  if (!user || !pwd) {
    return res
      .status(400)
      .json({ error: "Username and password are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(pwd, 10); // Use 'pwd' here to hash the password
    const addUser = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(addUser, [user, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ id: result.insertId, user });
    });
  } catch (error) {
    console.error("Error hashing password:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { user, pwd } = req.body; // Changed field names to match the frontend

  if (!user || !pwd) {
    return res
      .status(400)
      .json({ error: "Username and password are required!" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [user], async (err, result) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const userRecord = result[0];

    try {
      const match = await bcrypt.compare(pwd, userRecord.password); // Use 'pwd' here
      if (match) {
        const payload = { id: userRecord.id, username: userRecord.username }; // Include user ID in payload
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({
          success: true,
          message: "Authenticated",
          token,
          username: userRecord.username,
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials!" });
      }
    } catch (err) {
      console.error("Error during password comparison:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
