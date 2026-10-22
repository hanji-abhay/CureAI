
import express from "express";
import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const allowedTypes = ["thyroid", "skin", "lung", "breast"];

const allowedFields = {
  thyroid: [
    "ageGroup",
    "diagnosis",
    "symptoms",
    "duration",
    "bloodTest",
    "medication",
    "notes",
  ],
};

function validateAnswers(assessmentType, answers) {
  if (
    !answers ||
    typeof answers !== "object" ||
    Array.isArray(answers)
  ) {
    return "Please provide valid assessment answers.";
  }

  const fields = allowedFields[assessmentType];

  if (!fields) {
    return "This assessment type is not configured yet.";
  }

  const unexpectedField = Object.keys(answers).find(
    (field) => !fields.includes(field)
  );

  if (unexpectedField) {
    return "The answers contain an unsupported field.";
  }

  if (
    answers.ageGroup !== undefined &&
    typeof answers.ageGroup !== "string"
  ) {
    return "Invalid age group.";
  }

  if (
    answers.diagnosis !== undefined &&
    typeof answers.diagnosis !== "string"
  ) {
    return "Invalid diagnosis response.";
  }

  if (
    answers.symptoms !== undefined &&
    (!Array.isArray(answers.symptoms) ||
      !answers.symptoms.every((item) => typeof item === "string"))
  ) {
    return "Invalid symptoms response.";
  }

  if (
    answers.duration !== undefined &&
    typeof answers.duration !== "string"
  ) {
    return "Invalid duration response.";
  }

  if (
    answers.bloodTest !== undefined &&
    typeof answers.bloodTest !== "string"
  ) {
    return "Invalid blood test response.";
  }

  if (
    answers.medication !== undefined &&
    typeof answers.medication !== "string"
  ) {
    return "Invalid medication response.";
  }

  if (
    answers.notes !== undefined &&
    (typeof answers.notes !== "string" ||
      answers.notes.length > 500)
  ) {
    return "Notes must be 500 characters or fewer.";
  }

  const allowedAgeGroups = [
    "",
    "Under 18",
    "18–29",
    "30–44",
    "45–59",
    "60 or above",
    "Prefer not to say",
  ];

  const allowedDiagnoses = [
    "",
    "Yes",
    "No",
    "Not sure",
    "Prefer not to say",
  ];

  const allowedDurations = [
    "",
    "Less than two weeks",
    "Two weeks to three months",
    "More than three months",
    "It varies",
    "Not applicable",
  ];

  const allowedBloodTests = [
    "",
    "Recently",
    "In the past",
    "Never",
    "Not sure",
  ];

  const allowedMedication = [
    "",
    "Yes",
    "No",
    "Not sure",
    "Not applicable",
  ];

  if (
    answers.ageGroup !== undefined &&
    !allowedAgeGroups.includes(answers.ageGroup)
  ) {
    return "Invalid age group selection.";
  }

  if (
    answers.diagnosis !== undefined &&
    !allowedDiagnoses.includes(answers.diagnosis)
  ) {
    return "Invalid diagnosis selection.";
  }

  if (
    answers.duration !== undefined &&
    !allowedDurations.includes(answers.duration)
  ) {
    return "Invalid duration selection.";
  }

  if (
    answers.bloodTest !== undefined &&
    !allowedBloodTests.includes(answers.bloodTest)
  ) {
    return "Invalid blood test selection.";
  }

  if (
    answers.medication !== undefined &&
    !allowedMedication.includes(answers.medication)
  ) {
    return "Invalid medication selection.";
  }

  if (answers.symptoms !== undefined) {
    const allowedSymptoms = [
      "Unusual tiredness",
      "Unexpected weight changes",
      "Feeling unusually cold or hot",
      "Changes in heart rate",
      "Hair thinning or hair loss",
      "Changes in mood or concentration",
      "Neck swelling or discomfort",
      "Changes in sleep",
      "None of these",
    ];

    if (
      !answers.symptoms.every((symptom) =>
        allowedSymptoms.includes(symptom)
      ) ||
      (answers.symptoms.includes("None of these") &&
        answers.symptoms.length > 1)
    ) {
      return "Invalid symptom selection.";
    }
  }

  return null;
}

// Save a completed assessment for the signed-in user.
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { assessmentType, answers } = req.body ?? {};

    if (!allowedTypes.includes(assessmentType)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid assessment type.",
      });
    }

    const validationError = validateAnswers(assessmentType, answers);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const assessment = await Assessment.create({
      user: req.user._id,
      assessmentType,
      answers,
    });

    return res.status(201).json({
      success: true,
      message: "Assessment saved successfully.",
      assessment: {
        id: assessment._id,
        assessmentType: assessment.assessmentType,
        answers: assessment.answers,
        status: assessment.status,
        createdAt: assessment.createdAt,
      },
    });
  } catch (error) {
    console.error("Save assessment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save this assessment right now.",
    });
  }
});

// Retrieve only the signed-in user's assessment history.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const assessments = await Assessment.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select("assessmentType status createdAt updatedAt")
      .lean();

    return res.status(200).json({
      success: true,
      assessments,
    });
  } catch (error) {
    console.error("Assessment history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load assessment history right now.",
    });
  }
});

// Retrieve one assessment, only if it belongs to the signed-in user.
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID.",
      });
    }

    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error("Assessment detail error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load this assessment right now.",
    });
  }
});

export default router;
