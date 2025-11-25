import { db } from "../config/db.js";

export const getAllSubjects = (callback) => {
  db.query(
    "SELECT subject_id, title, description FROM subjects",
    (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    }
  );
};
