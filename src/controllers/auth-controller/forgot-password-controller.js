import crypto from "crypto";
import {
  getUserByEmail,
  setResetToken,
} from "../../models/auth-model/user-model.js";
import { sendEmail } from "../../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  const user = await getUserByEmail(username);
  // Svara alltid 200 för GDPR/sekretess
  if (!user) {
    console.log("User not found:", username);
    return res.json({
      message: "If the account exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expires = Date.now() + 15 * 60 * 1000;
  await setResetToken(user.id, tokenHash, expires);

  const resetURL = `http://localhost:5173/reset-password?token=${resetToken}`;
  try {
    console.log("Sending email to:", user.email);

    await sendEmail(user.email, "Reset your password", `Click: ${resetURL}`);
    console.log("sendEmail finished successfully.");
  } catch (err) {
    console.error("Send email error:", err);
  }

  return res.json({ message: "If the user exists, an email has been sent." });
};
