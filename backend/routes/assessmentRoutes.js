import express from "express";
import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  validateAnswers,
  validatePrediction,
} from "../utils/assessmentValidation.js";

const router = express.Router();

// Save a completed assessment for the authenticated user.
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { assessmentType, answers, prediction } = req.body ?? {};

    if (
      !Object.prototype.hasOwnProperty.call(assessmentSchemas, assessmentType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid assessment type.",
      });
    }

    const answersError = validateAnswers(assessmentType, answers);

    if (answersError) {
      return res.status(400).json({
        success: false,
        message: answersError,
      });
    }

    const predictionError = validatePrediction(assessmentType, prediction);

    if (predictionError) {
      return res.status(400).json({
        success: false,
        message: predictionError,
      });
    }

    const assessment = await Assessment.create({
      user: req.user._id,
      assessmentType,
      answers,
      prediction,
    });

    return res.status(201).json({
      success: true,
      message: "Assessment saved successfully.",
      assessment: {
        id: assessment._id,
        assessmentType: assessment.assessmentType,
        answers: assessment.answers,
        prediction: assessment.prediction,
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

// Retrieve assessment history for the authenticated user.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const assessments = await Assessment.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select("assessmentType prediction status createdAt updatedAt")
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

// Retrieve one assessment only if it belongs to the authenticated user.
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
