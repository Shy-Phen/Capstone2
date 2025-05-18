import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createEvaluation,
  getAllEvaluation,
  getOneEvaluation,
  updateEvaluation,
  deleteEvaluation,
} from "../contollers/evaluateControllers.js";

const route = express.Router();

route.post("/", verifyToken, createEvaluation);

route.get("/", verifyToken, getAllEvaluation);

route.get("/:id", verifyToken, getOneEvaluation);

route.put("/:id", verifyToken, updateEvaluation);

route.delete("/:id", verifyToken, deleteEvaluation);

export default route;
