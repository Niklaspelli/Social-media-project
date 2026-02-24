import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { verifyCsrfToken } from "./middleware/csrf.js";

const app = express();
app.use(helmet());

// ✅ 1. Parse cookies och JSON först
app.use(cookieParser());
app.use(express.json());

// ✅ 2. CORS innan dina routes
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

// ✅ 3. Rate limiting
/* const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter); */

// En generösare limit för vanlig data-hämtning
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

// En striktare limit för känsliga anrop
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 timme
  max: 10,
});

app.use("/api/overview", apiLimiter);
app.use("/api/responses", apiLimiter);
app.use("/auth/login", strictLimiter);

// ✅ 4. Global CSRF-skydd för skrivande metoder
app.use((req, res, next) => {
  const protectedMethods = ["POST", "PUT", "PATCH", "DELETE"];

  // ❌ Routes som INTE ska kräva CSRF
  const csrfExempt = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh-token",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
  ];

  if (csrfExempt.includes(req.path)) {
    return next();
  }

  // ✔ Endast skydda skrivande metoder som INTE är undantagna
  if (protectedMethods.includes(req.method)) {
    return verifyCsrfToken(req, res, next);
  }

  next();
});
// ✅ 5. Dina routes
const routes = (await import("./routes/index.js")).default;
app.use("/api", routes);

// ✅ 6. Fallback
app.use((req, res) => res.status(404).send("Not found"));

export default app;
