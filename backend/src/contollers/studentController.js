import { Student, Section } from "../models/studentModel.js";

export const createStudent = async (req, res) => {
  const { studentFullName, section } = req.body;
  try {
    if (!studentFullName || !section) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }
    const createdBy = req.userId;

    const sec = await Section.findById(section);

    if (!sec) {
      return res.status(404).json({ message: "Section not found" });
    }

    const newStudent = new Student({
      studentFullName,
      section: sec,
      createdBy,
    });
    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      newStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ createdBy: req.userId })
      .sort({
        studentFullName: 1,
      })
      .collation({ locale: "en", strength: 2 })
      .populate({ path: "section", select: "sectionName" });

    if (!students) {
      res.status(404).json({ message: "No student found" });
    }

    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Errorr",
    });
  }
};
export const getStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findOne({
      _id: id,
      createdBy: req.userId,
    }).populate({ path: "section", select: "sectionName" });
    if (!student) {
      res.status(404).json({ message: "Student nott found" });
    }
    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getStudentBySection = async (req, res) => {
  const { secId } = req.params;
  try {
    const studentUnderSec = await Student.find({
      section: secId,
    })
      .sort({ studentFullName: 1 })
      .populate({ path: "section", select: "sectionName" });

    if (!studentUnderSec) {
      return res.status(404).json({ message: "No Student Found" });
    }

    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: studentUnderSec,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.userId;
  try {
    const existingStudent = await Student.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        error: "Student not found or unauthorized",
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: id, createdBy: userId },
      updateData,
      {
        new: true,
      }
    ).populate({ path: "section", select: "sectionName" });

    if (!updatedStudent) {
      return res.status(400).json({
        success: false,
        error: "Failed to update student",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student Updated Successfully",
      data: updatedStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const searchStudent = async (req, res) => {
  try {
    const user = req.userId;
    const { query } = req.body;
    console.log(query);
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty search query",
      });
    }

    const sanitizedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchQuery = {
      createdBy: user,
      studentFullName: { $regex: sanitizedQuery, $options: "i" },
    };

    const foundStudents = await Student.find(searchQuery).populate({
      path: "section",
      select: "sectionName",
    });

    return res.status(200).json({
      success: true,
      message: foundStudents.length ? "Students found" : "No students found",
      data: foundStudents,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const existingStudent = await Student.findOne({
      _id: id,
      createdBy: req.userId,
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        error: "Student not found or unauthorized",
      });
    }

    await Student.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error creating assessment framework:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
