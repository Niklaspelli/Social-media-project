import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "forum",
});

// Connect to MySQL
db.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL:", error.message);
  } else {
    console.log("MySQL is connected! Woop Woop!");
  }
});

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log("JWT verification failed:", err);
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Extract the user object from the token
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Register a new user
app.post("/register", async (req, res) => {
  const { user, pwd } = req.body;

  if (!user) return res.status(400).json({ error: "Användarnamn behövs!" });
  if (!pwd) return res.status(400).json({ error: "Lösenord behövs!" });

  try {
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const addUser = "INSERT INTO users (username, password) VALUES (?, ?)";
    const values = [user, hashedPassword];

    db.query(addUser, values, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const output = {
        id: result.insertId,
        username: user,
      };
      res.status(201).json(output); // Send response with created status
    });
  } catch (error) {
    console.error("Error hashing password:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res.status(400).json({ error: "Användarnamn och lösenord behövs!" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [user], async (err, result) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: "Användarnamn finns ej!" });
    }

    const userRecord = result[0];

    try {
      const match = await bcrypt.compare(pwd, userRecord.password);
      if (match) {
        const payload = { id: userRecord.id, username: userRecord.username }; // Include user ID in payload
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({
          success: true,
          message: "Godkänd",
          token: token,
          username: userRecord.username,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Felaktigt lösenord!" });
      }
    } catch (err) {
      console.error("Error during password comparison:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// Protect routes
app.get("/protected", authenticateJWT, (req, res) => {
  res.status(200).json({ message: "This is a protected route" });
});

// Create a new forum thread
app.post("/forum/threads", authenticateJWT, async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user.id;

  // Input validation
  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required." });
  }

  try {
    const insertQuery =
      "INSERT INTO threads (user_id, title, body) VALUES (?, ?, ?)";
    db.query(insertQuery, [userId, title, body], (error, results) => {
      if (error) {
        console.error("Error creating thread:", error);
        return res.status(500).json({ message: "Failed to create thread" });
      }
      res
        .status(201)
        .json({ message: "Thread created successfully", id: results.insertId });
    });
  } catch (error) {
    console.error("Unexpected error while creating thread:", error);
    res.status(500).json({ message: "Failed to create thread" });
  }
});

// Get all forum threads
app.get("/forum/threads", async (req, res) => {
  try {
    const query = "SELECT * FROM threads";
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching threads:", error);
        return res.status(500).json({ message: "Failed to fetch threads" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Unexpected error while fetching threads:", error);
    res.status(500).json({ message: "Failed to fetch threads" });
  }
});

// Get a specific thread with responses
app.get("/forum/threads/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const [thread] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM threads WHERE id = ?",
        [threadId],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });

    const responses = await new Promise((resolve, reject) => {
      db.query(
        "SELECT responses.*, users.username FROM responses JOIN users ON responses.user_id = users.id WHERE thread_id = ?",
        [threadId],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found." });
    }

    res.status(200).json({ thread, responses });
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "Failed to fetch thread" });
  }
});

// Post a response to a thread
app.post("/forum/threads/:threadId/responses", authenticateJWT, (req, res) => {
  const { threadId } = req.params;
  const { body } = req.body; // Extracting body from the request
  const userId = req.user.id; // Getting user ID from JWT token

  if (!body) {
    return res.status(400).json({ message: "Response body is required." });
  }

  const insertResponseQuery =
    "INSERT INTO responses (thread_id, user_id, body) VALUES (?, ?, ?)";

  db.query(insertResponseQuery, [threadId, userId, body], (error, result) => {
    if (error) {
      console.error("Error posting response:", error);
      return res.status(500).json({ message: "Failed to post response." });
    }

    res.status(201).json({
      message: "Response posted successfully.",
      response: {
        id: result.insertId,
        body,
        user_id: userId,
        created_at: new Date(), // Add this if you want to set the current date for the new response
      },
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
