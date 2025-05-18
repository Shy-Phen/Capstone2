import express from "express";
import {
  createAssessmentFramework,
  getAssessmentFramework,
  getOneAssessmentFramework,
  updateAssessmentFramework,
  deleteAssessmentFramework,
} from "../contollers/assessmentFrameworkController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", verifyToken, createAssessmentFramework);

router.get("/", verifyToken, getAssessmentFramework);

router.get("/:id", verifyToken, getOneAssessmentFramework);

router.put("/:id", verifyToken, updateAssessmentFramework);

router.delete("/:id", verifyToken, deleteAssessmentFramework);

export default router;
