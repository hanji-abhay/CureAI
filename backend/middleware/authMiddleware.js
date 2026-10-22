
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please sign in.",
    });
  }

  const token = authHeader.slice(7);

  if (!process.env.JWT_SECRET) {
    console.error("Authentication error: JWT_SECRET is not configured.");

    return res.status(500).json({
      success: false,
      message: "Authentication is temporarily unavailable.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or expired. Please sign in again.",
    });
  }

  try {
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found. Please sign in again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify your account right now.",
    });
  }
}
