import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { SECURE, HTTP_ONLY, SAME_SITE } from "../config.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
} from "../domain/auth_handler.js";

dotenv.config();

// Register user
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const addUser = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(addUser, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ id: result.insertId, username });
    });
  } catch (error) {
    console.error("Error hashing password:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, result) => {
    if (err) {
      console.error("Error fetching user data:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      console.log("Login attempt with non-existent username:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userRecord = result[0];
    console.log("User found:", userRecord);

    try {
      const match = await bcrypt.compare(password, userRecord.password);
      console.log("Password comparison result:", match);

      if (match) {
        const payload = {
          id: userRecord.id,
          username: userRecord.username,
          avatar: userRecord.avatar, // Add the avatar here
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        const csrfToken = generateCsrfToken(payload);

        // Set cookies with appropriate attributes
        res.cookie("accessToken", accessToken, {
          httpOnly: HTTP_ONLY,
          secure: process.env.NODE_ENV === "production", // Set to true in production only
          maxAge: 15 * 60 * 1000, // 15 minutes
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Set to "None" in production
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: HTTP_ONLY,
          secure: process.env.NODE_ENV === "production", // Set to true in production only
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Set to "None" in production
        });

        res.cookie("csrfToken", csrfToken, {
          httpOnly: false, // Must be false if you want to access it from JavaScript!

          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000,
        });

        return res.json({
          userId: userRecord.id,
          username: userRecord.username,
          avatar: userRecord.avatar,
          accessToken, // ✅ include this
        });
      } else {
        console.log("Password mismatch for user:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Error during password comparison:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export const getCsrfToken = (req, res) => {
  const csrfToken = req.cookies.csrfToken;
  res.json({ csrfToken });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production", // Change based on environment
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production", // Change based on environment
  });
  res.clearCookie("csrfToken", {
    httpOnly: false, // If it's not an HTTP-only cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Logout successful" });
};

export const deleteUser = (req, res) => {
  const userId = req.params.userId;
  console.log(`Received DELETE request for user ID: ${userId}`);

  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  });
};

export const updateAvatar = async (req, res) => {
  const userId = req.user.id; // ✅ Comes from verified JWT
  const { avatar } = req.body;
  if (!userId || !avatar) {
    return res
      .status(400)
      .json({ error: "User ID and avatar URL are required." });
  }

  const sql = "UPDATE users SET avatar = ? WHERE id = ?";
  db.query(sql, [avatar, userId], (err, result) => {
    if (err) {
      console.error("Error updating avatar:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Avatar updated successfully" });
  });
};
