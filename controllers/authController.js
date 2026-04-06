import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mail.js";
import crypto from "crypto";
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ✅ REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    res.json({
      message: "Register successful",
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 🔍 Check user
    const user = await User.findOne({ email });

    // 🔐 Don't reveal if user exists
    if (!user) {
      return res.json({
        message: "If this email exists, reset link sent",
      });
    }

    // 🔑 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // 🔗 Frontend reset link
    const resetLink = `https://pwdclientpro.netlify.app/change-password/${resetToken}`;

    try {
      // 📧 Send email via Brevo API
      await tranEmailApi.sendTransacEmail({
        sender: {
          email: "rajmaharichi30@gmail.com", // ✅ MUST be verified in Brevo
          name: "Maha App",
        },
        to: [{ email: user.email }],
        subject: "Password Reset",
        htmlContent: `
          <h3>Password Reset</h3>
          <p>You requested to reset your password.</p>
          <p>Click below link:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link will expire in 10 minutes.</p>
        `,
      });

      console.log("✅ Email sent to:", user.email);

      return res.json({
        message: "Reset link sent to email",
      });
    } catch (mailError) {
      console.log(
        "❌ EMAIL ERROR:",
        mailError.response?.body || mailError.message,
      );

      return res.status(500).json({
        message: "Email sending failed",
      });
    }
  } catch (error) {
    console.log("❌ FORGOT ERROR:", error.message);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("RESET ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
