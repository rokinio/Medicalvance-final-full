import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";
import { Op } from "sequelize";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      location, // نام جدید
      languages,
      education,
      tags,
      ...profileData
    } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userData = {
      email,
      password,
      role,
      location, // استفاده از نام جدید
      languages: languages ? JSON.parse(languages) : [], // تبدیل رشته JSON به آرایه
      education,
      tags: tags ? JSON.parse(tags) : [], // تبدیل رشته JSON به آرایه
      ...profileData,
      isAccountApproved: role === "doctor" ? false : true,
      status: role === "doctor" ? "pending" : "approved",
      emailVerificationToken: uuidv4().substring(0, 6).toUpperCase(),
    };

    if (role === "doctor" && req.files) {
      if (req.files.profileImage)
        userData.profileImage = req.files.profileImage[0].path;
      if (req.files.documents)
        userData.documents = req.files.documents.map((f) => f.path);
    }

    const user = await User.create(userData);

    await sendVerificationEmail(user.email, user.emailVerificationToken);

    const responseUser = user.toJSON();
    delete responseUser.password;

    res.status(201).json({
      ...responseUser,
      token: generateToken(user.id),
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid user data", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      const responseUser = user.toJSON();
      delete responseUser.password;

      res.json({
        ...responseUser,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// تابع اصلاح شده و امن
export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    // کاربری که توکن JWT او در هدر ارسال شده را از دیتابیس پیدا می‌کنیم
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.emailVerificationToken === code) {
      user.isEmailVerified = true;
      user.emailVerificationToken = null; // توکن را پس از استفاده پاک می‌کنیم
      await user.save();
      res.json({ message: "Email verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        message:
          "If a user with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = uuidv4().substring(0, 6).toUpperCase();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ message: "Reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { code, password } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: code,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    user.password = password; // The hook will hash it
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
