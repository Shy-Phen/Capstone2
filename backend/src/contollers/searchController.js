import AssessmentFramework from "../models/assessmentFrameworkModel.js";
import { Evaluate } from "../models/evaluate.js";

export const searchRubric = async (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).json({ message: "Missing request parameters" });
    }

    const user = req.userId;
    const { query } = req.params;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ message: "Invalid or empty search query" });
    }

    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const rubric = await AssessmentFramework.find({
      createdBy: user,
      title: { $regex: sanitizedQuery, $options: "i" },
    }).sort({ createdAt: -1 });
    console.log(sanitizedQuery);
    // Check if results were found
    if (!rubric || rubric.length === 0) {
      return res
        .status(404)
        .json({ message: "No rubrics found matching your search" });
    }
    return res.status(200).json({ rubric });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error in searchRubric controller");
  }
};

export const searchEvaluate = async (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).json({ message: "Missing request parameters" });
    }

    const user = req.userId;
    const { query } = req.params;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ message: "Invalid or empty search query" });
    }

    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const evaluate = await Evaluate.find({
      createdBy: user,
      title: { $regex: sanitizedQuery, $options: "i" },
    }).sort({ createdAt: -1 });

    // Check if results were found
    if (!evaluate || evaluate.length === 0) {
      return res
        .status(404)
        .json({ message: "No rubrics found matching your search" });
    }

    return res.status(200).json({ evaluate });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error in searchEvaluate controller");
  }
};
