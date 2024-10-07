import bcrypt from "bcryptjs";
import { db } from "../config/db.js"; // Adjust this import according to your project structure
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is defined in your .env file

// Register user
export const registerUser = async (req, res) => {
  const { user, pwd } = req.body; // Destructure username and password

  // Input validation
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ error: "Username and password are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(pwd, 10); // Hash the password
    const addUser = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(addUser, [user, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err.message); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ id: result.insertId, user });
    });
  } catch (error) {
    console.error("Error hashing password:", error.message); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { user, pwd } = req.body; // Destructure username and password

  // Input validation
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ error: "Username and password are required!" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [user], async (err, result) => {
    if (err) {
      console.error("Error fetching data:", err.message); // Log the error
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const userRecord = result[0];

    try {
      // Compare the hashed password with the user input password
      const match = await bcrypt.compare(pwd, userRecord.password);
      if (match) {
        // Create JWT token if credentials are valid
        const payload = { id: userRecord.id, username: userRecord.username }; // Include user ID in payload
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({
          success: true,
          message: "Authenticated",
          token,
          username: userRecord.username,
          id: userRecord.id,
          avatar: userRecord.avatar,
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials!" });
      }
    } catch (err) {
      console.error("Error during password comparison:", err.message); // Log the error
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

// Delete user
export const deleteUser = (req, res) => {
  const userId = req.params.id; // Extract the ID from the request params
  console.log(`Received DELETE request for user ID: ${userId}`); // Log the ID for debugging

  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the user was deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  });
};

//Update
export const updateAvatar = async (req, res) => {
  const { userId } = req.body; // Get userId from request body
  const { avatar } = req.body.updatedData; // Get avatar from updatedData

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
