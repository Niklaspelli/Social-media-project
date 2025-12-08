import { db } from "../../config/db.js";
import { promisify } from "util";
import bcrypt from "bcryptjs";

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

export const setResetToken = async (userId, tokenHash, expires) => {
  const sql =
    "UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?";
  await query(sql, [tokenHash, expires, userId]);
};

export const getUserByResetToken = async (tokenHash) => {
  const now = Date.now();
  const sql = `SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`;
  const result = await query(sql, [tokenHash, now]);
  return result[0];
};

export const updatePassword = async (userId, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  const sql = `UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?`;
  await query(sql, [hashed, userId]);
};

export const getUserByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  const result = await query(sql, [email]);
  return result[0];
};

export const deleteUserById = async (userId) => {
  return await query(`DELETE FROM users WHERE id = ?`, [userId]);
};
