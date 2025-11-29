import {
  getThreadsBySubject,
  countThreadsBySubject,
  getThreadById,
  createThread,
  getLatestThreads,
  countAllThreads,
} from "../../models/thread.model.js";

// Hämta threads per subject
export const getThreadsController = async (req, res) => {
  try {
    const subject_id = req.query.subject_id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = ((parseInt(req.query.page) || 1) - 1) * limit;

    const threads = await getThreadsBySubject(subject_id, limit, offset);
    const total = await countThreadsBySubject(subject_id);

    res.json({
      threads,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
    });
  } catch (err) {
    console.error("Error fetching threads:", err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
};

// Skapa ny thread
export const createThreadController = async (req, res) => {
  try {
    const { title, body, subject_id } = req.body;
    const user_id = req.user?.id;

    if (!title || !body || !subject_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const insertId = await createThread({ title, body, subject_id, user_id });

    res.status(201).json({ message: "Thread created", id: insertId });
  } catch (err) {
    console.error("Error creating thread:", err);
    res.status(500).json({ error: "Failed to create thread" });
  }
};

// Hämta thread via ID
export const getThreadController = async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await getThreadById(threadId);

    if (!thread) return res.status(404).json({ error: "Thread not found" });

    res.json(thread);
  } catch (err) {
    console.error("Error fetching thread:", err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
};

// Hämta senaste threads
export const getLatestThreadsController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const subjectId = req.query.subjectId || req.query.subject_id;

    const sort = req.query.sort || "desc"; // <-- NY

    const threads = await getLatestThreads(limit, offset, sort, subjectId);
    const total = await countAllThreads(subjectId);

    res.json({
      threads,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      sort,
      subjectId,
    });
  } catch (err) {
    console.error("Error fetching latest threads:", err);
    res.status(500).json({ error: "Failed to fetch latest threads" });
  }
};
