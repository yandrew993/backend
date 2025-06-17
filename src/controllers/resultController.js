import prisma from "../lib/prisma.js";

// Get all results for a student
export const getResultsByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const results = await prisma.result.findMany({
      where: { studentId },
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results" });
    console.log(error)
  }
};

export const getFeeByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const results = await prisma.fees.findMany({
      where: { studentId },
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fee payments" });
    console.log(error)
  }
};

// ✅ New: Get all results for a specific teacher
export const getResultsByTeacherId = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const results = await prisma.result.findMany({
      where: { teacherId: teacherId }, // Convert to integer if necessary
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch results for the teacher" });
  }
};

// Add a new result for a student
export const addResult = async (req, res) => {
  const { studentId, subject, marks, teacherId, term, className, studentName } = req.body;

  // Validate required fields
  if (!studentId || !subject || !marks || !teacherId || !term || !className || !studentName) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Create a new result entry
    const newResult = await prisma.result.create({
      data: {
        subject,
        marks,
        teacherId,
        studentId,
        term,
        className,
        studentName,
        year: currentYear, // Save the current year
      },
    });

    res.status(201).json(newResult);
  } catch (error) {
    console.error("Error adding result:", error);
    res.status(500).json({ error: "Failed to add result" });
  }
};

// Update a result
export const updateResult = async (req, res) => {
  const { id } = req.params; // Extract the result ID from the request parameters
  const { marks } = req.body; // Extract marks from the request body

  // Validate that marks are provided
  if (marks === undefined || marks === null) {
    return res.status(400).json({
      success: false,
      error: "Marks are required",
      code: "MISSING_FIELDS",
    });
  }

  try {
    // Validate marks is a number
    if (isNaN(marks)) {
      return res.status(400).json({
        success: false,
        error: "Marks must be a number",
        code: "INVALID_MARKS",
      });
    }

    // Find the existing result by ID
    const existingResult = await prisma.result.findUnique({
      where: { id },
    });

    if (!existingResult) {
      return res.status(404).json({
        success: false,
        error: "Result not found",
        code: "NOT_FOUND",
      });
    }

    // Update the marks in the database
    const updatedResult = await prisma.result.update({
      where: { id },
      data: { marks: parseInt(marks) }, // Ensure marks are stored as an integer
    });

    // Respond with the updated result
    res.status(200).json({
      success: true,
      data: updatedResult,
      message: "Marks updated successfully",
    });
  } catch (error) {
    console.error("Update result error:", error);

    // Handle Prisma-specific errors
    if (error.code === "P2023") {
      return res.status(400).json({
        success: false,
        error: "Invalid result ID format",
        code: "INVALID_ID",
      });
    }

    // Handle general server errors
    res.status(500).json({
      success: false,
      error: "Failed to update marks",
      code: "SERVER_ERROR",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete a result
// Delete all results for a specific student
export const deleteResult = async (req, res) => {
  const { id } = req.params;

  try {
    // First, find if the student has any results
    let existingResults;

    try {
      existingResults = await prisma.result.findMany({
        where: { studentId: id },
      });
    } catch (error) {
      if (error.code === 'P2023') {
        return res.status(400).json({
          success: false,
          error: "Invalid student ID format",
          code: "INVALID_ID"
        });
      }
      throw error;
    }

    if (!existingResults || existingResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No results found for this student",
        code: "NOT_FOUND"
      });
    }

    // Delete all results for the student
    await prisma.result.deleteMany({
      where: { studentId: id },
    });

    res.status(200).json({
      success: true,
      message: "All results for the student deleted successfully"
    });

  } catch (error) {
    console.error("Delete result error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to delete student results",
      code: "SERVER_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export default {
  getResultsByStudentId,
  getResultsByTeacherId, // ✅ Export new function
  addResult,
  updateResult,
  deleteResult,
  getFeeByStudentId
};
