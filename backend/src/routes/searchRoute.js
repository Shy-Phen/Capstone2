import express from "express";

import {
  searchRubric,
  searchEvaluate,
} from "../contollers/searchController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/rubric/:query", verifyToken, searchRubric);
router.get("/evaluated/:query", verifyToken, searchEvaluate);

export default router;
