import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { gemini } from "../contollers/geminiApiController.js";
import { rateLimit } from "../middleware/ratelLimiting.js";

const route = express.Router();

route.post("/", verifyToken, rateLimit, gemini);

export default route;
