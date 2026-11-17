import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import RefreshToken from "../models/RefreshToken.js";

const COOKIE_NAME = "cureai-refresh";
const REMEMBERED_SESSION_DAYS = 30;
const TEMPORARY_SESSION_HOURS = 12;

function getCookieOptions(rememberMe = false) {
  const isProd = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth",
    maxAge: rememberMe
      ? REMEMBERED_SESSION_DAYS * 24 * 60 * 60 * 1000
      : TEMPORARY_SESSION_HOURS * 60 * 60 * 1000,
  };

  return options;
}

function readCookie(req, name) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = part.slice(0, separatorIndex).trim();

    if (key === name) {
      return part.slice(separatorIndex + 1).trim();
    }
  }

  return null;
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function createAccessToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
}

async function createSession(user, res, rememberMe = false) {
  const refreshToken = randomBytes(32).toString("hex");

  const sessionDuration = rememberMe
    ? REMEMBERED_SESSION_DAYS * 24 * 60 * 60 * 1000
    : TEMPORARY_SESSION_HOURS * 60 * 60 * 1000;

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + sessionDuration),
    rememberMe,
  });

  res.cookie(COOKIE_NAME, refreshToken, getCookieOptions(rememberMe));

  return createAccessToken(user._id);
}

function clearRefreshCookie(res) {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth",
  });
}

export {
  COOKIE_NAME,
  clearRefreshCookie,
  createAccessToken,
  createSession,
  hashToken,
  readCookie,
};
