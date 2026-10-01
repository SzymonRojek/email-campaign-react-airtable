const crypto = require("crypto");

const TOKEN_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 hours

const sign = (payload) =>
  crypto
    .createHmac("sha256", process.env.AUTH_SECRET)
    .update(payload)
    .digest("base64url");

const safeEqual = (a, b) => {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();

  return crypto.timingSafeEqual(hashA, hashB);
};

exports.isAuthConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);

exports.isPasswordCorrect = (password) =>
  safeEqual(password, process.env.ADMIN_PASSWORD);

exports.createToken = () => {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TOKEN_LIFETIME_MS })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
};

exports.verifyToken = (token) => {
  const [payload, signature] = String(token).split(".");

  if (!payload || !signature || !safeEqual(signature, sign(payload))) {
    return false;
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());

    return Date.now() < exp;
  } catch (error) {
    return false;
  }
};
