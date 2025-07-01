import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "../services/emailService.js";
import { Op } from "sequelize";

// تابع برای گرفتن تمام کاربران
export const getUsers = async (req, res) => {
  try {
    const { role, status, search, tab } = req.query;
    const whereClause = {};

    if (role && role !== "all") whereClause.role = role;
    if (status && status !== "all") whereClause.status = status;

    if (tab === "pending") {
      whereClause.role = "doctor";
      whereClause.status = "pending";
    }

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { alias: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// تابع برای تایید دکتر
export const approveDoctor = async (req, res) => {
  const doctor = await User.findByPk(req.params.id);
  if (doctor && doctor.role === "doctor") {
    doctor.status = "approved";
    doctor.isAccountApproved = true;
    await doctor.save();
    res.json({ message: "Doctor approved successfully" });
  } else {
    res.status(404).json({ message: "Doctor not found" });
  }
};

// تابع برای رد کردن دکتر
export const rejectDoctor = async (req, res) => {
  const doctor = await User.findByPk(req.params.id);
  if (doctor && doctor.role === "doctor") {
    doctor.status = "rejected";
    doctor.isAccountApproved = false;
    await doctor.save();
    res.json({ message: "Doctor rejected successfully" });
  } else {
    res.status(404).json({ message: "Doctor not found" });
  }
};

// تابع برای ارسال ایمیل ریست پسورد
export const triggerPasswordReset = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = uuidv4().substring(0, 6).toUpperCase();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ message: `Password reset email sent to ${user.email}.` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- تابع جدید برای حذف کاربر ---
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "کاربر پیدا نشد" });
    }

    // جلوگیری از حذف کاربر با نقش ادمین
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "امکان حذف کاربر ادمین وجود ندارد." });
    }

    await user.destroy();
    res.json({ message: "کاربر با موفقیت حذف شد." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
