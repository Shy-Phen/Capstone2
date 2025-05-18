import AssessmentFramework from "../models/assessmentFrameworkModel.js";
import { Evaluate } from "../models/evaluate.js";
import { Student } from "../models/studentModel.js";

export const getStats = async (req, res) => {
  try {
    const user = req.userId;

    const totalEvaluations = await Evaluate.countDocuments({ createdBy: user });
    const totalRubrics = await AssessmentFramework.countDocuments({
      createdBy: user,
    });
    const totalStudent = await Student.countDocuments({ createdBy: user });

    res.status(200).json({
      totalEvaluations,
      totalRubrics,
      totalStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEval = async (req, res) => {
  try {
    const user = req.userId;

    const evaluate = await Evaluate.find({ createdBy: user })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title createdAt ");

    res.status(201).json({ evaluate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRub = async (req, res) => {
  try {
    const user = req.userId;

    const rub = await AssessmentFramework.find({ createdBy: user })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title createdAt");

    res.status(201).json({ rub });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
