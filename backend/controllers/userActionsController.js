import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    Change user password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  try {
    const user = await User.findByPk(req.user.id);
    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid current password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload additional documents
export const uploadDocument = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.files && req.files.documents) {
      const newPaths = req.files.documents.map((file) => file.path);
      user.documents = [...(user.documents || []), ...newPaths];
      await user.save();

      const updatedUser = user.toJSON();
      delete updatedUser.password;
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: "No documents uploaded" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
