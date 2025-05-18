import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getStats, getEval, getRub } from "../contollers/statsController.js";

const route = express.Router();

route.get("/", verifyToken, getStats);
route.get("/Eval", verifyToken, getEval);
route.get("/Rub", verifyToken, getRub);

export default route;
