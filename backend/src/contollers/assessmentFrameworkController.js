import AssessmentFramework from "../models/assessmentFrameworkModel.js";

export const createAssessmentFramework = async (req, res) => {
  try {
    const { title, scoringScale, criteriaArray, total } = req.body;
    const createdBy = req.userId;

    if (!title || !scoringScale || !criteriaArray || !total)
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });

    for (const item of scoringScale) {
      if (!item.score || !item.description)
        return res.status(400).json({
          success: false,
          message: "Score and description is required",
        });
    }

    const assessmentFramework = new AssessmentFramework({
      title,
      scoringScale,
      criteriaArray,
      createdBy,
      total,
    });
    await assessmentFramework.save();

    res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      assessmentFramework,
    });
  } catch (error) {
    console.error("Error creating assessment framework:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAssessmentFramework = async (req, res) => {
  try {
    const user = req.userId;
    const assessmenTframeworkCreatedByCurrentUser =
      await AssessmentFramework.find({ createdBy: user }).sort({
        createdAt: -1,
      });

    if (!assessmenTframeworkCreatedByCurrentUser)
      return res.status(404).json({ message: "No assessment framework found" });

    res.status(200).json(assessmenTframeworkCreatedByCurrentUser);
  } catch (error) {}
};

export const getOneAssessmentFramework = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;

    const assessmentFramework = await AssessmentFramework.findById(id);

    if (!assessmentFramework)
      return res
        .status(404)
        .json({ message: false, message: "No assessment framework Found" });

    if (user != assessmentFramework.createdBy.toString())
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this assessment framework",
      });

    res.status(200).json({ success: true, assessmentFramework });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAssessmentFramework = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;
    const updates = req.body;

    // Find the assessment framework first
    const assessmentFramework = await AssessmentFramework.findById(id);

    if (!assessmentFramework) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    // Check authorization
    if (assessmentFramework.createdBy.toString() !== user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this assessment framework",
      });
    }

    // Update basic fields
    if (updates.title) assessmentFramework.title = updates.title;
    if (updates.total) assessmentFramework.total = updates.total;

    // Update scoring scale
    if (updates.scoringScale && Array.isArray(updates.scoringScale)) {
      assessmentFramework.scoringScale = updates.scoringScale;
    }

    // Handle criteria array with special care for _ids
    if (updates.criteriaArray && Array.isArray(updates.criteriaArray)) {
      // Clear existing criteria array and rebuild it
      // This approach works better than trying to merge/update in place
      const newCriteriaArray = [];

      updates.criteriaArray.forEach((newCriterion, index) => {
        // If an existing criterion is available at this index, preserve its _id
        if (assessmentFramework.criteriaArray[index]) {
          newCriteriaArray.push({
            ...newCriterion,
            _id: assessmentFramework.criteriaArray[index]._id,
          });
        } else {
          // For new criteria, let MongoDB generate an _id
          newCriteriaArray.push(newCriterion);
        }
      });

      // Replace the entire criteria array
      assessmentFramework.criteriaArray = newCriteriaArray;
    }

    // Save the updated document
    await assessmentFramework.save();

    console.log("Assessment framework updated successfully");

    res.status(200).json({
      success: true,
      message: "Rubric updated successfully",
      updatedFramework: assessmentFramework,
    });
  } catch (error) {
    console.error("Error updating assessment framework:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Include error message for debugging
    });
  }
};

export const deleteAssessmentFramework = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;

    const ass = await AssessmentFramework.findByIdAndDelete(id);

    if (!ass)
      return res
        .status(404)
        .json({ success: false, message: "Asessment framework not found" });

    if (ass.createdBy.toString() != user)
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this assessment framework",
      });

    res
      .status(200)
      .json({ success: true, message: "Deleted successfully", ass });
  } catch (error) {}
};
