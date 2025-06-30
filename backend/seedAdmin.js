import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const adminEmail = "admin@medplatform.com";
const adminPassword = "password123";

const seedAdminUser = async () => {
  try {
    // ابتدا به دیتابیس متصل می‌شویم
    await connectDB();

    // چک می‌کنیم که آیا کاربر ادمین از قبل وجود دارد یا نه
    const adminExists = await User.findOne({ where: { email: adminEmail } });

    if (adminExists) {
      console.log("Admin user already exists.");
      process.exit();
    }

    // اگر وجود نداشت، آن را می‌سازیم
    await User.create({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isEmailVerified: true, // ادمین نیازی به تایید ایمیل ندارد
      isAccountApproved: true,
      status: "approved",
    });

    console.log("Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit();
  } catch (error) {
    console.error(`Error seeding admin user: ${error.message}`);
    process.exit(1);
  }
};

seedAdminUser();
