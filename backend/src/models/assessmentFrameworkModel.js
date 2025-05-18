import mongoose from "mongoose";

const assessmentFramweworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    scoringScale: [
      {
        description: {
          type: String,
          required: [true, "Description is required"],
        },
        score: {
          type: Number,
          required: [true, "Score is required"],
          min: [0, "Score must be at least 0"],
        },
      },
    ],
    criteriaArray: [
      {
        criterion: { type: String, required: true },
        descriptor: [{ type: String }],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const AssessmentFramework = mongoose.model(
  "AssessmentFramework",
  assessmentFramweworkSchema
);

export default AssessmentFramework;
