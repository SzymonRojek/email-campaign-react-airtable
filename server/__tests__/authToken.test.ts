import {
  createToken,
  isAuthConfigured,
  isPasswordCorrect,
  verifyToken,
} from "../helpers/authToken";

describe("authToken", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "secret-password";
    process.env.AUTH_SECRET = "test-auth-secret";
  });

  it("is configured only with both env variables", () => {
    expect(isAuthConfigured()).toBe(true);

    delete process.env.AUTH_SECRET;

    expect(isAuthConfigured()).toBe(false);
  });

  it("checks the admin password", () => {
    expect(isPasswordCorrect("secret-password")).toBe(true);
    expect(isPasswordCorrect("wrong")).toBe(false);
    expect(isPasswordCorrect(undefined)).toBe(false);
  });

  it("accepts a fresh token", () => {
    expect(verifyToken(createToken())).toBe(true);
  });

  it("rejects an expired token", () => {
    expect(verifyToken(createToken(-1000))).toBe(false);
  });

  it("rejects a tampered token", () => {
    const [, signature] = createToken().split(".");
    const forgedPayload = Buffer.from(
      JSON.stringify({ exp: Date.now() + 10 ** 10 })
    ).toString("base64url");

    expect(verifyToken(`${forgedPayload}.${signature}`)).toBe(false);
    expect(verifyToken(`${createToken()}x`)).toBe(false);
  });

  it("rejects a token signed with another secret", () => {
    const token = createToken();

    process.env.AUTH_SECRET = "another-secret";

    expect(verifyToken(token)).toBe(false);
  });

  it("rejects garbage", () => {
    expect(verifyToken("")).toBe(false);
    expect(verifyToken("abc")).toBe(false);
    expect(verifyToken(undefined)).toBe(false);
  });
});
