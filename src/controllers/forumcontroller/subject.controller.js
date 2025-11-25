import { getAllSubjects } from "../../models/subject.model.js";

export const getSubjectsController = (req, res) => {
  getAllSubjects((err, subjects) => {
    if (err) {
      console.error("Error fetching subjects:", err);
      return res.status(500).json({ error: "Failed to fetch subjects" });
    }
    res.status(200).json(subjects);
  });
};
