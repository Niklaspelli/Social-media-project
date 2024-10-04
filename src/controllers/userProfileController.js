// controllers/userProfileController.js

import { db } from "../config/db.js"; // Adjust the import based on your project structure

// Create or update user profile
export const createOrUpdateUserProfile = (req, res) => {
  const userId = req.user.id; // Get user ID from the JWT token
  const { sex, relationship_status, location, music_taste, interests, bio } =
    req.body;

  // Validate input
  if (!userId || !sex || !relationship_status || !location) {
    return res.status(400).json({ error: "Missing required fields!" });
  }

  // SQL query to insert or update user profile
  const sql = `
    INSERT INTO user_profiles (user_id, sex, relationship_status, location, music_taste, interests, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      sex = VALUES(sex),
      relationship_status = VALUES(relationship_status),
      location = VALUES(location),
      music_taste = VALUES(music_taste),
      interests = VALUES(interests),
      bio = VALUES(bio)
  `;

  db.query(
    sql,
    [userId, sex, relationship_status, location, music_taste, interests, bio],
    (err, result) => {
      if (err) {
        console.error("Error creating or updating user profile:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({ message: "User profile saved successfully." });
    }
  );
};

// Get user profile
export const getUserProfile = (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT * FROM user_profiles WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user profile:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json(results[0]); // Return the first profile found
  });
};
