// backend/controllers/doctorController.js
import User from "../models/User.js";
import { Op } from "sequelize";

// @desc    Fetch all approved doctors with optional filters
// @route   GET /api/doctors
// @access  Public
export const getApprovedDoctors = async (req, res) => {
  try {
    const { search, location, language } = req.query;

    const whereClause = {
      role: "doctor",
      status: "approved",
      isEmailVerified: true,
    };

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { specialties: { [Op.like]: `%${search}%` } },
      ];
    }

    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    if (language) {
      // زبان‌ها به صورت یک رشته جدا شده با کاما دریافت می‌شوند
      const languages = language.split(",");

      // برای هر زبان یک شرط `LIKE` ایجاد می‌کنیم
      const languageClauses = languages.map((lang) => ({
        languages: {
          [Op.substring]: `"${lang.trim()}"`,
        },
      }));

      // اطمینان می‌دهیم که پزشک به *تمام* زبان‌های انتخاب شده مسلط باشد
      if (whereClause[Op.and]) {
        whereClause[Op.and].push(...languageClauses);
      } else {
        whereClause[Op.and] = languageClauses;
      }
    }

    const doctors = await User.findAll({
      where: whereClause,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "profileImage",
        "location",
        "specialties",
        "languages",
        "bio",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
