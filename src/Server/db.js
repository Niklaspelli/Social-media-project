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

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader)
    return res.status(401).json({ error: "Access denied, no token provided" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token" });
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

// Login a user
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
        const payload = { sub: userRecord.username };
        const token = jwt.sign(payload, SECRET_KEY, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          success: true,
          message: "Godkänd",
          token: token,
          username: userRecord.username, // Include username in the response
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

/* // Create a new post
app.post("/posts", authenticateJWT, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.sub; // Assuming the user's ID is stored in req.user.sub

  if (!title || !content || !userId) {
    return res.status(400).send("Title, content, and user ID are required");
  }

  // Fetch the user's username based on the user's ID
  const query = "SELECT username FROM users WHERE id = ?";
  db.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    const author = results[0].username;

    // Insert the post with the fetched author
    const insertQuery =
      "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)";
    db.query(
      insertQuery,
      [title, content, author],
      (insertError, insertResults) => {
        if (insertError) {
          return res.status(500).send(insertError);
        }
        const createdPost = {
          id: insertResults.insertId,
          title,
          content,
          author,
          date: new Date(),
        };
        res.status(201).send(createdPost);
      }
    );
  });
}); */
app.post("/posts", authenticateJWT, (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  db.query(
    "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)",
    [title, content, author],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to create post" });
      }
      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        id: result.insertId,
        title,
        content,
        author,
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

app.delete("/posts/:id", authenticateJWT, (req, res) => {
  const postId = req.params.id;
  const query = "DELETE FROM posts WHERE id = ?";
  db.query(query, [postId], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/* app.post("/posts", (req, res) => {
  const title = req.body.newPostTitle;
  const content = req.body.newPostContent;

  db.query(
    "INSERT INTO posts (title, content) VALUES (?,?)",
    [title, content],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to create post" });
      }
      console.log(result);
      res.status(201).json({ message: "Post created successfully" });
    }
  );
}); */
/* 
app.post("/posts", authenticateJWT, (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res
      .status(400)
      .send({ message: "Title, content, and author are required" });
  }
  // Insert the post into the database
  const query = "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)";
  db.query(query, [title, content, author], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    const createdPost = {
      id: results.insertId,
      title,
      content,
      author,
      date: new Date(),
    };
    res.status(201).send(createdPost);
  });
});
 */
//////////////////////////////////

/* app.post("/posts", authenticateJWT, (req, res) => {
  const title = req.body.newPostTitle;
  const content = req.body.newPostContent;
  const authorId = req.user.sub; // Assuming `req.user.sub` contains the user ID or username

  db.query(
    "INSERT INTO posts (title, content, author) VALUES (?,?,?)",
    [title, content, authorId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to create post" });
      }
      console.log(result);

      // Fetch additional user details from the "users" table
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [authorId],
        (userErr, userResult) => {
          if (userErr) {
            console.log(userErr);
            return res.status(500).json({ error: "Failed to fetch user" });
          }

          const author = userResult[0]; // Assuming there is only one user with the provided ID
          res
            .status(201)
            .json({ message: "Post created successfully", author });
        }
      );
    }
  );
}); */

// Route to get all posts
/* app.get("/posts", (req, res) => {
  const query = "SELECT * FROM posts";

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(results);
  });
}); */

/* // Delete post
app.delete("/posts/:postId", authenticateJWT, (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // Assuming user information is attached to the request after authentication

  // Check if the post belongs to the authenticated user
  const query = "SELECT * FROM posts WHERE id = ? AND id = ?";
  db.query(query, [postId, userId], (error, results) => {
    if (error) {
      console.error("Error checking post ownership:", error);
      return res.status(500).json({ error: "Något fel på server error" });
    }

    // If post doesn't exist or doesn't belong to the user
    if (results.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // If post exists and belongs to the user, proceed with deletion
    const deleteQuery = "DELETE FROM posts WHERE id = ?";
    db.query(deleteQuery, [postId], (error) => {
      if (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ error: "Något fel på  server error" });
      }
      res.sendStatus(204); // No content
    });
  });
}); */
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
