import bcrypt from "bcryptjs";
import {
  createUser,
  getUserByUsername,
} from "../../models/auth-model/user-model.js";
import { createUserProfile } from "../../models/auth-model/userprofile-model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
} from "../../domain/auth_handler.js";
import { SECURE, HTTP_ONLY, SAME_SITE } from "../../config.js";

// Register
export const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res
      .status(400)
      .json({ error: "Username, password, and email are required!" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(username, hashedPassword, email);
    await createUserProfile(userId);

    res.status(201).json({
      id: userId,
      username,
      email,
      message: "User registered and profile initialized",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  try {
    const user = await getUserByUsername(username);
    if (!user)
      return res.status(401).json({ message: "Wrong username or password!" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Wrong username or password!" });

    const payload = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const csrfToken = generateCsrfToken(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: HTTP_ONLY,
      secure: SECURE,
      maxAge: 15 * 60 * 1000,
      sameSite: SAME_SITE,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: HTTP_ONLY,
      secure: SECURE,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: SAME_SITE,
    });

    res.json({
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      accessToken,
      csrfToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
