
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

    answers: {
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
  }
);

assessmentSchema.index({ user: 1, createdAt: -1 });

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
