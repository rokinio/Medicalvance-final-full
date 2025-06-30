import express from "express";
import {
  getUsers, // <-- جایگزین شد
  approveDoctor,
  rejectDoctor,
  triggerPasswordReset,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/users", getUsers); // <-- روت اصلی و جدید ما
router.put("/doctors/:id/approve", approveDoctor);
router.put("/doctors/:id/reject", rejectDoctor);
router.post("/users/:id/reset-password", triggerPasswordReset);

export default router;
