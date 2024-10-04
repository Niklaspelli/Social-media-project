import { db } from "../config/db.js"; // Adjust the import based on your project structure

// Update user profile
export const updateUserProfile = (req, res) => {
  const userId = req.user?.id; // Safely access user ID
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" }); // User is not authenticated
  }

  const { sex, relationship_status, location, music_taste, interest, bio } =
    req.body;

  // Validate input
  if (!sex || !relationship_status || !location) {
    return res.status(400).json({ error: "Missing required fields!" });
  }

  // SQL query to update user profile
  const sql = `
        UPDATE user_profiles 
        SET 
            sex = ?, 
            relationship_status = ?, 
            location = ?, 
            music_taste = ?, 
            interest = ?, 
            bio = ? 
        WHERE user_id = ?
    `;

  console.log("SQL Values:", [
    sex,
    relationship_status,
    location,
    music_taste,
    interest,
    bio,
    userId,
  ]); // Debugging output

  db.query(
    sql,
    [sex, relationship_status, location, music_taste, interest, bio, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user profile:", err.message);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message }); // Return error details
      }

      // Check if any row was updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User profile not found" });
      }

      res.status(200).json({ message: "User profile updated successfully." });
    }
  );
};

export const getUserProfile = (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT * FROM user_profiles WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user profile:", err.message);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message }); // Return error details
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json(results[0]); // Return the first profile found
  });
};

export const createOrUpdateUserProfile = (req, res) => {
  const userId = req.user?.id; // Get the user ID from the request
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" }); // User not authenticated
  }

  const { sex, relationship_status, location, music_taste, interest, bio } =
    req.body;

  // Validate input
  if (!sex || !relationship_status || !location) {
    return res.status(400).json({ error: "Missing required fields!" });
  }

  // SQL query to insert or update user profile
  const sql = `
    INSERT INTO user_profiles (user_id, sex, relationship_status, location, music_taste, interest, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
        sex = VALUES(sex),
        relationship_status = VALUES(relationship_status),
        location = VALUES(location),
        music_taste = VALUES(music_taste),
        interest = VALUES(interest),
        bio = VALUES(bio)
  `;

  db.query(
    sql,
    [userId, sex, relationship_status, location, music_taste, interest, bio],
    (err, result) => {
      if (err) {
        console.error("Error creating or updating user profile:", err.message);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message }); // Return error details
      }

      res.status(200).json({ message: "User profile saved successfully." });
    }
  );
};
