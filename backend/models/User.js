import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    pronouns: {
      type: String,
      enum: ["", "she/her", "he/him", "they/them", "other"],
      default: "",
    },

    country: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "India",
    },

    preferences: {
      reminders: {
        type: Boolean,
        default: false,
      },
      updates: {
        type: Boolean,
        default: true,
      },
    },

    // Password recovery fields
    passwordResetTokenHash: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
