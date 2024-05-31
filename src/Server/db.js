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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users",
});

db.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL:", error.message);
  } else {
    console.log("MySQL is connected! Woop Woop!");
  }
});

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log("JWT verification failed:", err);
        return res.sendStatus(403);
      }
      req.user = user; // Extract the user object from the token
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Register a new user
app.post("/register", async (req, res) => {
  const { user, pwd } = req.body;

  if (!user) return res.status(400).send("Användarnamn behövs!");
  if (!pwd) return res.status(400).send("Lösenord behövs!");

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
      res.json(output);
    });
  } catch (error) {
    console.error("Error hashing password:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
        const token = jwt.sign(payload, SECRET_KEY, {
          expiresIn: "1h",
        });
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

app.post("/posts", authenticateJWT, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id; // Extract user ID from the authenticated user

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  db.query(
    "INSERT INTO posts (title, content, author_id, author) VALUES (?, ?, ?, ?)",
    [title, content, userId, req.user.username], // Use userId and username as the author's ID and name
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create post" });
      }

      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        id: result.insertId,
        title,
        content,
        author: req.user.username, // Return the author's name
      });
    }
  );
});

app.get("/posts", (req, res) => {
  const query = "SELECT * FROM posts";
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).send(results);
  });
});

/* app.delete("/posts/:id", authenticateJWT, (req, res) => {
  const postId = req.params.id;
  const query = "DELETE FROM posts WHERE id = ?";
  db.query(query, [postId], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(204).send();
  });
}); */
app.delete("/posts/:postId", authenticateJWT, (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // Extract user ID from the authenticated user

  console.log(`Delete request for postId: ${postId} by userId: ${userId}`);

  // Check if the post belongs to the authenticated user
  const query = "SELECT * FROM posts WHERE id = ? AND author_id = ?";
  db.query(query, [postId, userId], (error, results) => {
    if (error) {
      console.error("Error checking post ownership:", error);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      console.log(
        `Post with id ${postId} not found or does not belong to user ${userId}`
      );
      return res.status(403).json({ error: "Unauthorized" });
    }

    // If post exists and belongs to the user, proceed with deletion
    const deleteQuery = "DELETE FROM posts WHERE id = ?";
    db.query(deleteQuery, [postId], (error) => {
      if (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ error: "Server error" });
      }
      console.log(
        `Post with id ${postId} deleted successfully by user ${userId}`
      );
      res.sendStatus(204); // No content
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
/* 
app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM posts WHERE id= ?", id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to delete post" });
    }
    console.log(result);
    res.status(201).json({ message: "Post deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */
