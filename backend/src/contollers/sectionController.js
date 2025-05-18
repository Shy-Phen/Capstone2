import { Section, Student } from "../models/studentModel.js";

export const createSection = async (req, res) => {
  const { sectionName } = req.body;
  try {
    if (!sectionName) {
      res.status(400).json({ message: "All fields are required" });
    }

    const newSection = new Section({
      sectionName,
      createdBy: req.userId,
    });

    await newSection.save();
    res.status(201).json({
      success: true,
      message: "Section created successfully",
      newSection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create section",
      error: error.message,
    });
  }
};

export const getSections = async (req, res) => {
  try {
    const sections = await Section.find({
      createdBy: req.userId,
    });

    if (!sections || sections.length === 0) {
      return res
        .status(404)
        .json({ message: "No sections found for this user" });
    }

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get sections",
      error: error.message,
    });
  }
};

export const getSection = async (req, res) => {
  const { id } = req.params;
  try {
    const sec = await Section.findById(id);

    if (!sec) {
      return res.status(404).json({ message: "section not found" });
    }

    if (sec && sec.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      success: true,
      data: sec,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get sections",
      error: error.message,
    });
  }
};

export const updateSection = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const sec = await Section.findOne({ _id: id, createdBy: req.userId });

    if (!sec) {
      return res.status(404).json({ message: "Not found or un auth" });
    }

    const updatedSection = await Section.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get sections",
      error: error.message,
    });
  }
};

export const deleteSection = async (req, res) => {
  const { id } = req.params;
  try {
    await Section.findOneAndDelete({ _id: id, createdBy: req.userId });

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get sections",
      error: error.message,
    });
  }
};
