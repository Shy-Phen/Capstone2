import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { gemini } from "../contollers/geminiApiController.js";

const route = express.Router();

route.post("/", verifyToken, gemini);

export default route;
