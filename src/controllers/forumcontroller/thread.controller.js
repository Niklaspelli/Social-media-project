import {
  getThreadsBySubject,
  countThreadsBySubject,
  getThreadById,
  createThread,
  getLatestThreads,
  countAllThreads,
} from "../../models/thread.model.js";

// Hämta threads per subject
export const getThreadsController = (req, res) => {
  const subject_id = req.query.subject_id;
  const limit = parseInt(req.query.limit) || 10;
  const offset = ((parseInt(req.query.page) || 1) - 1) * limit;

  getThreadsBySubject(subject_id, limit, offset, (err, threads) => {
    if (err) return res.status(500).json({ error: "Failed to fetch threads" });

    countThreadsBySubject(subject_id, (err, total) => {
      if (err)
        return res.status(500).json({ error: "Failed to count threads" });

      res.json({ threads, total, page: Math.floor(offset / limit) + 1, limit });
    });
  });
};

// Skapa ny thread
export const createThreadController = (req, res) => {
  const { title, body, subject_id } = req.body;
  const user_id = req.user?.id;

  if (!title || !body || !subject_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  createThread({ title, body, subject_id, user_id }, (err, insertId) => {
    if (err) return res.status(500).json({ error: "Failed to create thread" });
    res.status(201).json({ message: "Thread created", id: insertId });
  });
};

// Hämta thread via ID
export const getThreadController = (req, res) => {
  const { threadId } = req.params;

  getThreadById(threadId, (err, thread) => {
    if (err) return res.status(500).json({ error: "Failed to fetch thread" });
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    res.json(thread);
  });
};

// Hämta senaste threads
export const getLatestThreadsController = (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = ((parseInt(req.query.page) || 1) - 1) * limit;

  getLatestThreads(limit, offset, (err, threads) => {
    if (err)
      return res.status(500).json({ error: "Failed to fetch latest threads" });

    countAllThreads((err, total) => {
      if (err)
        return res.status(500).json({ error: "Failed to count threads" });

      res.json({ threads, total, page: Math.floor(offset / limit) + 1, limit });
    });
  });
};
