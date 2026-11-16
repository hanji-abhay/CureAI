import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assessmentType: {
      type: String,
      required: true,
      enum: ["thyroid", "skin", "lung", "breast"],
    },

    // Exact inputs submitted to the ML model.
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Complete response returned by the ML prediction API.
    prediction: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    status: {
      type: String,
      enum: ["completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  },
);

assessmentSchema.index({ user: 1, createdAt: -1 });

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
