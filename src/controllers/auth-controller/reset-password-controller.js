import crypto from "crypto";
import {
  getUserByResetToken,
  updatePassword,
} from "../../models/auth-model/user-model.js";

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password required!" });
  }

  // Hash token the same way as when storing it
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with this hashed token and not expired
  const user = await getUserByResetToken(tokenHash);

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  // Update password (this also clears token + expiry)
  await updatePassword(user.id, newPassword);

  return res.json({ message: "Password reset successful" });
};
