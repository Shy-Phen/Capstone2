import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../contollers/authContollers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/checkAuth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
