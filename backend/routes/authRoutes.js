import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and password.",
      });
    }

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2 || normalizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Full name must contain between 2 and 100 characters.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      normalizedEmail.length > 254 ||
      !emailPattern.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must contain between 8 and 128 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create your account right now.",
    });
  }
});

// Log in an existing user.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email and password.",
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    // Use the same response for an unknown email and a wrong password.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Login error: JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Login is temporarily unavailable.",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "You have signed in successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to sign in right now. Please try again.",
    });
  }
});


/* Get the currently signed-in user's profile. */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.toISOString().slice(0, 10)
          : "",
        pronouns: user.pronouns || "",
        country: user.country || "India",
        preferences: {
          reminders: user.preferences?.reminders ?? false,
          updates: user.preferences?.updates ?? true,
        },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load your profile right now.",
    });
  }
});

/* Update only the authenticated user's permitted profile fields. */
router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      email,
      dateOfBirth,
      pronouns,
      country,
      preferences,
    } = req.body;

    if (
      typeof fullName !== "string" ||
      typeof email !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide your full name and email address.",
      });
    }

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (normalizedName.length < 2 || normalizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Full name must contain between 2 and 100 characters.",
      });
    }

    if (
      normalizedEmail.length > 254 ||
      !emailPattern.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (
      dateOfBirth !== undefined &&
      dateOfBirth !== "" &&
      (
        typeof dateOfBirth !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ||
        Number.isNaN(Date.parse(`${dateOfBirth}T00:00:00.000Z`)) ||
        new Date(`${dateOfBirth}T00:00:00.000Z`)
          .toISOString().slice(0, 10) !== dateOfBirth ||
        dateOfBirth > new Date().toISOString().slice(0, 10)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date of birth that is not in the future.",
      });
    }

    const allowedPronouns = ["", "she/her", "he/him", "they/them", "other"];

    if (
      pronouns !== undefined &&
      !allowedPronouns.includes(pronouns)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid pronouns option.",
      });
    }

    if (
      country !== undefined &&
      (
        typeof country !== "string" ||
        !country.trim() ||
        country.trim().length > 100
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid country or region.",
      });
    }

    if (preferences !== undefined) {
      if (
        !preferences ||
        typeof preferences !== "object" ||
        Array.isArray(preferences) ||
        (
          preferences.reminders !== undefined &&
          typeof preferences.reminders !== "boolean"
        ) ||
        (
          preferences.updates !== undefined &&
          typeof preferences.updates !== "boolean"
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide valid preference settings.",
        });
      }
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "That email address is already linked to another account.",
      });
    }

    req.user.fullName = normalizedName;
    req.user.email = normalizedEmail;

    if (dateOfBirth !== undefined) {
      req.user.dateOfBirth = dateOfBirth || null;
    }

    if (pronouns !== undefined) {
      req.user.pronouns = pronouns;
    }

    if (country !== undefined) {
      req.user.country = country.trim();
    }

    if (preferences !== undefined) {
      const currentPreferences = req.user.preferences?.toObject?.() || {};

      req.user.preferences = {
        reminders: currentPreferences.reminders ?? false,
        updates: currentPreferences.updates ?? true,
        ...preferences,
      };
    }

    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Your profile has been saved successfully.",
      user: {
        id: req.user._id.toString(),
        fullName: req.user.fullName,
        email: req.user.email,
        dateOfBirth: req.user.dateOfBirth
          ? req.user.dateOfBirth.toISOString().slice(0, 10)
          : "",
        pronouns: req.user.pronouns || "",
        country: req.user.country || "India",
        preferences: {
          reminders: req.user.preferences?.reminders ?? false,
          updates: req.user.preferences?.updates ?? true,
        },
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "That email address is already linked to another account.",
      });
    }

    console.error("Profile update error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save your profile right now.",
    });
  }
});


const recoveryMessage =
  "If an account exists for that email, recovery instructions can be sent.";

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      email.trim().length > 254
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;
    const frontendUrl = process.env.FRONTEND_URL;

    if (
      !smtpHost ||
      !Number.isInteger(smtpPort) ||
      smtpPort < 1 ||
      smtpPort > 65535 ||
      !smtpUser ||
      !smtpPass ||
      !smtpFrom ||
      !frontendUrl
    ) {
      return res.status(503).json({
        success: false,
        message: "Password recovery email is not configured yet.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Do not disclose whether an account exists.
    if (!user) {
      return res.status(200).json({
        success: true,
        message: recoveryMessage,
      });
    }

    // Generate a random token, but store only its SHA-256 hash.
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenHash = createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetTokenHash = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetUrl = new URL(
      "/reset-password",
      frontendUrl.endsWith("/") ? frontendUrl : `${frontendUrl}/`
    );
    resetUrl.searchParams.set("token", resetToken);

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: user.email,
        subject: "Reset your CureAI password",
        text: [
          `Hello ${user.fullName},`,
          "",
          "We received a request to reset your CureAI password.",
          `Use this link within 15 minutes: ${resetUrl.toString()}`,
          "",
          "If you did not request this, you can ignore this email.",
        ].join("\n"),
        html: `
          <p>Hello ${user.fullName},</p>
          <p>We received a request to reset your CureAI password.</p>
          <p>
            <a href="${resetUrl.toString()}">Reset your password</a>
          </p>
          <p>This link expires in 15 minutes and can only be used once.</p>
          <p>If you did not request this, you can ignore this email.</p>
        `,
      });
    } catch (emailError) {
      // Remove the unused token if email delivery fails.
      user.passwordResetTokenHash = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      console.error("Password recovery email failed:", emailError.message);

      return res.status(502).json({
        success: false,
        message: "Unable to send recovery email right now. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: recoveryMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process your recovery request right now.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body ?? {};

    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/i.test(token) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid reset link and a password between 8 and 128 characters.",
      });
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetTokenHash +passwordResetExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This reset link is invalid or expired. Please request a new one.",
      });
    }

    user.password = await bcrypt.hash(password, 12);

    // Clear the token so it cannot be reused.
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your password has been reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset your password right now. Please try again.",
    });
  }
});


export default router;
