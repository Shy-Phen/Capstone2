import express from "express";
import { downloadReport } from "../contollers/downloadRepController.js";

const route = express.Router();

route.get("/:id", downloadReport);

export default route;
