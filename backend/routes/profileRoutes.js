import express from "express";
import {
  changePassword,
  uploadDocument,
} from "../controllers/userActionsController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.put("/change-password", protect, changePassword);
// برای آپلود مدارک جدید، از همان میدل‌ور آپلود استفاده می‌کنیم
router.post(
  "/documents",
  protect,
  upload.fields([{ name: "documents", maxCount: 5 }]),
  uploadDocument
);

export default router;
