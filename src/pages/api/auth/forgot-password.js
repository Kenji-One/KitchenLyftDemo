import connectDB from "../../../utils/db";
import User from "../../../models/User";
import { sendRecoveryEmail } from "../../../utils/email";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  await connectDB();

  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message:
        "If this email is registered, you will receive a password recovery link.",
    });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  await sendRecoveryEmail(user.email, resetUrl);

  res.status(200).json({
    message:
      "If this email is registered, you will receive a password recovery link.",
  });
}
