import { Request, Response } from "express";

import {
  isAuthConfigured,
  isPasswordCorrect,
  createToken,
} from "../helpers/authToken";
import { clientIp } from "../helpers/clientIp";

const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

// simple in-memory brute force protection: ip -> { count, blockedUntil }
const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

// only for tests
export const resetFailedAttempts = () => failedAttempts.clear();

export const login = (req: Request, res: Response) => {
  if (!isAuthConfigured()) {
    return res.status(500).json({
      status: "fail",
      error: "Login is not configured on the server",
    });
  }

  const ip = clientIp(req);
  const attempts = failedAttempts.get(ip) || { count: 0, blockedUntil: 0 };

  if (attempts.blockedUntil > Date.now()) {
    return res.status(429).json({
      status: "fail",
      error: "Too many failed attempts - please try again later",
    });
  }

  // phones may add a space after a word suggestion (or paste one) - "admin " is "admin"
  const password =
    typeof req.body?.password === "string" ? req.body.password.trim() : req.body?.password;

  if (!password || !isPasswordCorrect(password)) {
    attempts.count += 1;

    if (attempts.count >= MAX_FAILED_ATTEMPTS) {
      attempts.count = 0;
      attempts.blockedUntil = Date.now() + BLOCK_TIME_MS;
    }

    failedAttempts.set(ip, attempts);

    return res
      .status(401)
      .json({ status: "fail", error: "password is not correct" });
  }

  failedAttempts.delete(ip);

  res.status(200).json({ token: createToken() });
};
