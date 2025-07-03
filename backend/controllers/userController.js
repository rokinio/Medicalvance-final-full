import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      const updatableFields = [
        "alias",
        "firstName",
        "lastName",
        "phone",
        "location", // نام جدید
        "specialties",
        "website",
        "socialMedia",
        "bio",
        "languages", // فیلد جدید
        "education", // فیلد جدید
        "tags",
      ];

      updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          // برای فیلدهای JSON، اطمینان حاصل کنید که به صورت آرایه ذخیره می‌شوند
          if (field === "languages" || field === "tags") {
            user[field] = Array.isArray(req.body[field])
              ? req.body[field]
              : JSON.parse(req.body[field]);
          } else {
            user[field] = req.body[field];
          }
        }
      });

      if (req.file) {
        user.profileImage = req.file.path;
      }

      const updatedUser = await user.save();

      // Remove password from the returned object
      const userResponse = updatedUser.toJSON();
      delete userResponse.password;

      res.json(userResponse);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
