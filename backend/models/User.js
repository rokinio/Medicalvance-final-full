import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcryptjs";

class User extends Model {
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("patient", "doctor", "admin"),
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
    },
    alias: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    specialties: {
      type: DataTypes.TEXT,
    },
    website: {
      type: DataTypes.STRING,
    },
    socialMedia: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    documents: {
      type: DataTypes.JSON, // Storing array of strings
    },
    isAccountApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    languages: {
      type: DataTypes.JSON, // برای ذخیره آرایه‌ای از زبان‌ها
      defaultValue: [],
    },
    education: {
      type: DataTypes.TEXT, // برای ذخیره متن طولانی شامل سوابق تحصیلی
    },
    tags: {
      type: DataTypes.JSON, // برای ذخیره آرایه‌ای از تگ‌ها
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
