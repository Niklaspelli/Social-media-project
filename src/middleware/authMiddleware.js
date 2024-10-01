import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming token is in Bearer format

  if (!token) {
    return res.sendStatus(403); // Forbidden
  }

  // Use the secret from the environment variable
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user; // Save the user information to the request
    next();
  });
};
