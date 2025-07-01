import express from "express";
import {
  getUsers,
  approveDoctor,
  rejectDoctor,
  triggerPasswordReset,
  deleteUser, // تابع حذف باید اینجا باشد
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// تمام روت‌های این فایل نیاز به احراز هویت و نقش ادمین دارند
router.use(protect, authorize("admin"));

router.get("/users", getUsers);
router.put("/doctors/:id/approve", approveDoctor);
router.put("/doctors/:id/reject", rejectDoctor);
router.post("/users/:id/reset-password", triggerPasswordReset);

// --- روت جدید برای حذف کاربر ---
// این روت یک پارامتر id می‌گیرد
router.delete("/users/:id", deleteUser);

export default router;
