// backend/routes/doctorRoutes.js
import express from "express";
import { getApprovedDoctors } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getApprovedDoctors);

export default router;
