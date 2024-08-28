import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendRecoveryEmail = async (email, resetUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending recovery email:", error);
    throw new Error("There was an error sending the recovery email.");
  }
};

export const sendPaymentEmail = async (email, subject, text) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending payment email:", error);
    throw new Error("There was an error sending the payment email.");
  }
};
