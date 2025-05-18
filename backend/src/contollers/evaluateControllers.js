import AssessmentFramework from "../models/assessmentFrameworkModel.js";
import { Evaluate } from "../models/evaluate.js";

export const createEvaluation = async (req, res) => {
  try {
    console.log("Im hit");
    const {
      title,
      members,
      assessmentFramework,
      criteriaAndScore,
      criteriaTotalScore,
    } = req.body;
    const user = req.userId;

    if (
      !title ||
      !members ||
      !assessmentFramework ||
      !criteriaAndScore ||
      !criteriaTotalScore
    )
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });

    console.log("Jjj");

    const assF = await AssessmentFramework.findById(assessmentFramework);

    if (!assF) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment framework not found" });
    }

    const validScores = assF.scoringScale.map((scale) => scale.score);

    const isValid = criteriaAndScore.every((item) =>
      validScores.includes(item.score)
    );
    console.log("Valid Scores:", validScores, "Type:", typeof validScores[0]);

    console.log(
      "Scoring Scale:",
      assF.scoringScale.map((scale) => scale.score)
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message:
          "Each criteria score must match one of the scoring scale scores",
      });
    }

    const evaluate = new Evaluate({
      title,
      members,
      assessmentFramework: assF,
      createdBy: user,
      criteriaAndScore,
      criteriaTotalScore,
    });

    await evaluate.save();

    res.status(201).json({ evaluate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEvaluation = async (req, res) => {
  try {
    const user = req.userId;

    const evaluated = await Evaluate.find({ createdBy: user }).sort({
      createdAt: -1,
    });
    if (!evaluated) return res.status(404).json({ message: "No evaluation" });

    res.status(200).json(evaluated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOneEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;

    const evaluated = await Evaluate.findById(id).populate({
      path: "assessmentFramework",
      select: "scoringScale title criteriaArray total",
    });

    if (!evaluated) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    if (user.toString() !== evaluated.createdBy.toString()) {
      // Better comparison
      return res.status(401).json({
        success: false,
        message: "Unauthorized - you are not the creator",
      });
    }

    res.status(200).json({
      success: true,
      data: evaluated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;
    const update = req.body;

    const evaluated = await Evaluate.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (user != evaluated.createdBy.toString())
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!evaluated) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    res.status(200).json(evaluated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;

    const evaluated = await Evaluate.findById(id);

    if (!evaluated) {
      return res
        .status(404)
        .json({ success: false, message: "Evaluation not found" });
    }

    if (user !== evaluated.createdBy.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You are not allowed to delete this evaluation",
      });
    }

    await Evaluate.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
