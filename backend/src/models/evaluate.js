import mongoose from "mongoose";

const evaluateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    members: [
      {
        name: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
        },
      },
    ],
    assessmentFramework: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentFramework",
      required: [true, "Assessment framework is required"],
    },
    criteriaAndScore: [
      {
        criteriaName: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
      },
    ],
    criteriaTotalScore: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Evaluate = mongoose.model("Evaluate", evaluateSchema);
