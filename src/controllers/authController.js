import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import dotenv from "dotenv";
import { promisify } from "util";
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
    const insertUserSql =
      "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(insertUserSql, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const newUserId = result.insertId;
      // Skapa tom profilrad direkt
      const insertProfileSql = `
        INSERT INTO user_profiles 
          (user_id, sex, relationship_status, location, music_taste, interest, bio)
        VALUES (?, '', '', '', '', '', '')
      `;

      db.query(insertProfileSql, [newUserId], (profErr) => {
        if (profErr) {
          console.error("Error creating user profile:", profErr.message);
          // Om det failar här, kanske du vill ta bort användaren eller åtminstone notifiera
          return res
            .status(500)
            .json({ error: "User created but failed to initialize profile" });
        }

        // Allt lyckades
        res.status(201).json({
          id: newUserId,
          username,
          message: "User registered and profile initialized",
        });
      });
    });
  } catch (error) {
    console.error("Error hashing password:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

///Login
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
      return res.status(401).json({ message: "Wrong username or password!" });
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
          secure: SECURE, // Set to true in production only
          maxAge: 15 * 60 * 1000, // 15 minutes
          sameSite: SAME_SITE, // Set to "None" in production
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: HTTP_ONLY,
          secure: SECURE, // Set to true in production only
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: SAME_SITE, // Set to "None" in production
        });

        return res.json({
          userId: userRecord.id,
          username: userRecord.username,
          avatar: userRecord.avatar,
          accessToken,
          csrfToken, // ✅ include this
        });
      } else {
        console.log("Password mismatch for user:", username);
        return res.status(401).json({ message: "Wrong username or password!" });
      }
    } catch (err) {
      console.error("Error during password comparison:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

// CSRF-token endpoint
export const getCsrfToken = (req, res) => {
  const csrfToken = generateCsrfToken();

  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.json({ csrfToken });
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

const query = promisify(db.query).bind(db);

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // 1) Ta bort alla feed-poster för användaren
    await query(`DELETE FROM user_feed WHERE userId = ?`, [userId]);

    // 2) Ta bort användarens profil (om den finns)
    await query(`DELETE FROM user_profiles WHERE user_id = ?`, [userId]);

    // 3) Ta bort vänförfrågningar där användaren är sändare eller mottagare
    await query(
      `DELETE FROM friend_requests 
       WHERE sender_id = ? OR receiver_id = ?`,
      [userId, userId]
    );

    // … Lägg på fler rader för andra tabeller som har FK mot users …

    // 4) Slutligen, ta bort själva användaren
    const result = await query(`DELETE FROM users WHERE id = ?`, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//update avatar
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
