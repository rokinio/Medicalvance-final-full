import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Use multer for registration to handle optional file uploads for doctors
router.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  registerUser
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  loginUser
);

// The verification code is passed in the body, but protect middleware gets user from token
router.post("/verify-email", protect, verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
