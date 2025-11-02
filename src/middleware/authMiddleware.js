import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config.js"; // ✅ import the correct secret

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("JWT error:", err.message); // Log any JWT errors

      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // If the token is valid, attach the decoded user to the request object
    req.user = user;
    next();
  });
};
