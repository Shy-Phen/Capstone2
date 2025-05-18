import express from "express";
import {
  createSection,
  deleteSection,
  getSection,
  getSections,
  updateSection,
} from "../contollers/sectionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createSection);
router.get("/", verifyToken, getSections);
router.get("/:id", verifyToken, getSection);
router.put("/:id", verifyToken, updateSection);
router.delete("/:id", verifyToken, deleteSection);

export default router;
