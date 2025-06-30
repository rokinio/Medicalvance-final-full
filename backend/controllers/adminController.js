import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "../services/emailService.js";
import { Op } from "sequelize";

// تابع قبلی برای گرفتن پزشکان
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

// --- تابع جدید برای گرفتن بیماران ---
export const getPatients = async (req, res) => {
  try {
    const patients = await User.findAll({
      where: { role: "patient" },
      attributes: { exclude: ["password", "isAccountApproved", "status"] },
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// --- پایان تابع جدید ---

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
