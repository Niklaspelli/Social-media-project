import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config.js"; // Importing using ES Module syntax
import jwt from "jsonwebtoken"; // Import JWT
import crypto from "crypto"; // Import crypto

// Function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Function to generate CSRF token
const generateCsrfToken = () => {
  return crypto.randomBytes(16).toString("hex"); // Generate CSRF token
};

// Export functions as named exports
export { generateAccessToken, generateRefreshToken, generateCsrfToken };
