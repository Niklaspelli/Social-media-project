import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed" }); // 401 Unauthorized
  }

  const token = authHeader.split(" ")[1]; // Extract token part

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
};
