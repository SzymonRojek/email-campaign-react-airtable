const {
  isAuthConfigured,
  isPasswordCorrect,
  createToken,
} = require("../helpers/authToken");

const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

// simple in-memory brute force protection: ip -> { count, blockedUntil }
const failedAttempts = new Map();

exports.login = (req, res) => {
  if (!isAuthConfigured()) {
    return res.status(500).json({
      status: "fail",
      error: "Login is not configured on the server",
    });
  }

  const ip = req.ip;
  const attempts = failedAttempts.get(ip) || { count: 0, blockedUntil: 0 };

  if (attempts.blockedUntil > Date.now()) {
    return res.status(429).json({
      status: "fail",
      error: "Too many failed attempts - please try again later",
    });
  }

  const { password } = req.body;

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
