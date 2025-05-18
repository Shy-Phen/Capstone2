import express from "express";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudentBySection,
  getStudents,
  searchStudent,
  updateStudent,
} from "../contollers/studentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/", verifyToken, createStudent);
route.get("/", verifyToken, getStudents);
route.get("/oneStud/:id", verifyToken, getStudent);
route.get("/studentBySection/:secId", verifyToken, getStudentBySection);
route.post("/searchStudent", verifyToken, searchStudent);
route.put("/:id", verifyToken, updateStudent);
route.delete("/:id", verifyToken, deleteStudent);

export default route;
