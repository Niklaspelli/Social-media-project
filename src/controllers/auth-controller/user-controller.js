import {
  updateUserAvatar,
  deleteUserById,
} from "../../models/auth-model/user-model.js";
import { deleteUserProfile } from "../../models/auth-model/userprofile-model.js";
import { promisify } from "util";
import { db } from "../../config/db.js";

const query = promisify(db.query).bind(db);

export const updateAvatar = async (req, res) => {
  const userId = req.user.id;
  const { avatar } = req.body;
  if (!userId || !avatar)
    return res
      .status(400)
      .json({ error: "User ID and avatar URL are required." });

  try {
    const affectedRows = await updateUserAvatar(userId, avatar);
    if (affectedRows === 0)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    await query(`DELETE FROM user_feed WHERE userId = ?`, [userId]);
    await deleteUserProfile(userId);
    await query(
      `DELETE FROM friend_requests WHERE sender_id = ? OR receiver_id = ?`,
      [userId, userId]
    );
    const result = await deleteUserById(userId);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
