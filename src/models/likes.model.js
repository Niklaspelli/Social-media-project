import { db } from "../config/db.js";

export const toggleLike = async (user_id, response_id) => {
  const [rows] = await db.query(
    "SELECT * FROM response_likes WHERE user_id = ? AND response_id = ?",
    [user_id, response_id]
  );

  if (rows.length > 0) {
    await db.query(
      "DELETE FROM response_likes WHERE user_id = ? AND response_id = ?",
      [user_id, response_id]
    );
    return false; // unliked
  } else {
    await db.query(
      "INSERT INTO response_likes (user_id, response_id) VALUES (?, ?)",
      [user_id, response_id]
    );
    return true; // liked
  }
};

export const getLikeCount = async (response_id) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS likeCount FROM response_likes WHERE response_id = ?",
    [response_id]
  );
  return rows[0].likeCount;
};
