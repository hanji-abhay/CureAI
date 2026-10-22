
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import {
  COOKIE_NAME,
  clearRefreshCookie,
  createAccessToken,
  createSession,
  hashToken,
  readCookie,
} from "../utils/session.js";

const router = express.Router();

function publicUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  };
}

// Register and automatically establish a signed-in session.
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body ?? {};

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

    if (
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
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

    const user = await User.create({
      fullName: normalizedName,
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
    });

    const token = await createSession(user, res, false);

    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
      token,
      user: publicUser(user),
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

// Authenticate and create a refreshable session.
router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password ||
      typeof rememberMe !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid sign-in details.",
      });
    }

    if (password.length > 128) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
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

    const token = await createSession(user, res, rememberMe);

    return res.status(200).json({
      success: true,
      message: "You have signed in successfully.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to sign in right now. Please try again.",
    });
  }
});

// Exchange a valid refresh cookie for a new access token and refresh token.
router.post("/refresh", async (req, res) => {
  let replacementCreated = false;

  try {
    const rawToken = readCookie(req, COOKIE_NAME);

    if (!rawToken || !/^[a-f0-9]{64}$/i.test(rawToken)) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please sign in again.",
      });
    }

    const tokenHash = hashToken(rawToken);

    const session = await RefreshToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    }).select("+tokenHash");

    if (!session) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please sign in again.",
      });
    }

    const user = await User.findById(session.user);

    if (!user) {
      await RefreshToken.deleteOne({ _id: session._id });
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Account not found. Please sign in again.",
      });
    }

    // Atomically consume the old token so it cannot be reused.
    const consumedSession = await RefreshToken.findOneAndDelete({
      _id: session._id,
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!consumedSession) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Your session could not be renewed. Please sign in again.",
      });
    }

    const token = await createSession(user, res, session.rememberMe);
    replacementCreated = true;

    return res.status(200).json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Session refresh error:", error.message);

    if (!replacementCreated) {
      clearRefreshCookie(res);
    }

    return res.status(500).json({
      success: false,
      message: "Unable to renew your session right now.",
    });
  }
});

// Revoke the current session and clear its cookie.
router.post("/logout", async (req, res) => {
  try {
    const rawToken = readCookie(req, COOKIE_NAME);

    if (rawToken && /^[a-f0-9]{64}$/i.test(rawToken)) {
      await RefreshToken.deleteOne({
        tokenHash: hashToken(rawToken),
      });
    }

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,
      message: "You have signed out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error.message);

    clearRefreshCookie(res);

    return res.status(500).json({
      success: false,
      message: "Unable to complete sign out right now.",
    });
  }
});

export default router;
