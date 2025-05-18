import mongoose, { Mongoose } from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    sectionName: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const studentSchema = new mongoose.Schema(
  {
    studentFullName: { type: String, required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Section = mongoose.model("Section", sectionSchema);
export const Student = mongoose.model("Student", studentSchema);
