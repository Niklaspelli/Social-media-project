import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { AUTH, AUTH_TYPES } from "./config.js";

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
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
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

const forumRoutes = (await import("./routes/forumRoutes.js")).default;
app.use("/api/auth", forumRoutes);

app.use((req, res) => res.status(404).send("Not found"));

export default app;
