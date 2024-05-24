import express from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

app.use(cors());
// app.use(express.json());
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

app.get("/cors", (req, res) => {
  const sqlCors = "SELECT * FROM cors";
  db.query(sqlCors, (errorCors, resultsCors) => {
    if (errorCors) {
      console.error("Error fetching cors data:", errorCors.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Combine results from both tables and send response
    const combinedResults = {
      cors: resultsCors,
    };
    res.json(combinedResults);
  });
});

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
        const token = jwt.sign(payload, "Ekorrensattigranen12%%", {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
