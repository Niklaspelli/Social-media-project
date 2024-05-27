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

const SECRET_KEY = "Ekorrensattigranen12%%";

// Middleware to authenticate JWT token
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

  if (!user) {
    return res.status(400).send("Användarnamn behövs!");
  }

  if (!pwd) {
    return res.status(400).send("Lösenord behövs!");
  }

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
    console.log("userRecord", userRecord.password);

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

app.post("/posts", (req, res) => {
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
});

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
app.get("/posts", (req, res) => {
  const query = "SELECT * FROM posts";

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(results);
  });
});

// Delete post
app.delete("/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  const deleteId = "DELETE FROM posts WHERE id = ?";
  db.query(deleteId, postId, (error) => {
    if (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.sendStatus(204); // No content
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
