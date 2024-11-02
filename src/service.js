import express from "express"; // Use import statement
import cors from "cors";
import helmet from "helmet";

import rateLimit from "express-rate-limit";
import { AUTH, AUTH_TYPES } from "./config.js"; // Ensure to add .js if using ES modules

const app = express();

const forumRoutes = {
  [AUTH_TYPES.BASIC]: (await import("./routes/forumRoutes.js")).default, // Dynamically import the forum routes
};

const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        // Allow requests with no origin (e.g., mobile apps or server-side calls)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Use 'windowMs' instead of 'windows'
  max: 100,
});

app.use(limiter);
app.use(express.json());
app.use(helmet());

app.use("/api/auth", forumRoutes[AUTH_TYPES.BASIC]);
app.use((req, res) => res.status(404).send("Not found"));

export default app; // Default export of app
