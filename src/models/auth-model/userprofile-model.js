import { db } from "../../config/db.js";
import { promisify } from "util";

const query = promisify(db.query).bind(db);

export const createUserProfile = async (userId) => {
  const sql = `
    INSERT INTO user_profiles 
      (user_id, sex, relationship_status, location, music_taste, interest, bio)
    VALUES (?, '', '', '', '', '', '')
  `;
  return await query(sql, [userId]);
};

export const deleteUserProfile = async (userId) => {
  return await query(`DELETE FROM user_profiles WHERE user_id = ?`, [userId]);
};
