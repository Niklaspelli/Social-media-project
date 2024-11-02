/* import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./config/db.js"; // Adjusted import path
import forumRoutes from "./routes/forumRoutes.js"; // Adjusted import path

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Use express built-in JSON parser

// Connect to MySQL
db.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL:", error.message);
    process.exit(1); // Exit process on error
  }
  console.log("MySQL is connected! Woop Woop!");
});

// Use routes
app.use("/forum", forumRoutes); // Ensure this matches your fetch requests

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 */
import { db } from "./config/db.js";
import forumRoutes from "./routes/forumRoutes.js";
import {
  PORT,
  AUTH,
  AUTH_TYPES,
  HTTP_ONLY,
  SECURE,
  SAME_SITE,
} from "./config.js";

import app from "./service.js";

app.use("/forum", forumRoutes);

// Connect to MySQL
db.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL:", error.message);
    process.exit(1); // Exit process on error
  }
  console.log("MySQL is connected! Woop Woop!");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Failed to start the server ${err}`);
  }
  console.log(`server running on port ${PORT}`);
  console.log(`Using ${AUTH} authentication`);
  console.log(`HTTPOnly is ${HTTP_ONLY}`);
  console.log(`Secure is ${SECURE}`);
  console.log(`Same site is ${SAME_SITE}`);
});
