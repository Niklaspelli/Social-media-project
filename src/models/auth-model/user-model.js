import { db } from "../../config/db.js";
import { promisify } from "util";

const query = promisify(db.query).bind(db);

export const createUser = async (username, hashedPassword, email) => {
  const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  const result = await query(sql, [username, hashedPassword, email]);
  return result.insertId;
};

export const getUserByUsername = async (username) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  const result = await query(sql, [username]);
  return result[0];
};

export const updateUserAvatar = async (userId, avatar) => {
  const sql = "UPDATE users SET avatar = ? WHERE id = ?";
  const result = await query(sql, [avatar, userId]);
  return result.affectedRows;
};

export const deleteUserById = async (userId) => {
  return await query(`DELETE FROM users WHERE id = ?`, [userId]);
};
