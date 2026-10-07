import crypto from "crypto";

const TOKEN_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 hours

const sign = (payload: string) =>
  crypto
    .createHmac("sha256", process.env.AUTH_SECRET as string)
    .update(payload)
    .digest("base64url");

export const safeEqual = (a: unknown, b: unknown) => {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();

  return crypto.timingSafeEqual(hashA, hashB);
};

export const isAuthConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);

export const isPasswordCorrect = (password: unknown) =>
  safeEqual(password, process.env.ADMIN_PASSWORD);

export const createToken = (lifetimeMs = TOKEN_LIFETIME_MS) => {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + lifetimeMs })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
};

export const verifyToken = (token: unknown) => {
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
