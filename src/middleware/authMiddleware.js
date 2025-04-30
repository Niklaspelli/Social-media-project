import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ACCESS_TOKEN_SECRET } from "../config.js"; // ✅ import the correct secret

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader); // Debug log

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }

  const secretKey = process.env.ACCESS_TOKEN_SECRET;

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log("JWT error:", err.message); // Log any JWT errors

      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // If the token is valid, attach the decoded user to the request object
    req.user = user;
    next();
  });
};

/* NY KOD:
import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  // Get the token from cookies instead of the Authorization header
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access token missing" }); // 401 Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" }); // 403 Forbidden
    }

    req.user = user; // Attach the decoded user to the request
    next();
  });
}; */
