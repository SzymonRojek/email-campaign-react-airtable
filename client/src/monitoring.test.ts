import { hideSecrets, monitoringOptions } from "./monitoring";

describe("error monitoring", () => {
  const options = monitoringOptions("https://key@sentry.example/1", "staging");

  it("never sends the opt-out token", () => {
    expect(hideSecrets("https://app.example.com/#/opt-out/recAnna.abc-DEF_1")).toBe(
      "https://app.example.com/#/opt-out/[token]"
    );
    expect(hideSecrets("https://app.example.com/#/job-offers/rec1")).toBe(
      "https://app.example.com/#/job-offers/rec1"
    );
  });

  it("collects no personal data", () => {
    expect(options.environment).toBe("staging");
    expect(options.dataCollection).toMatchObject({
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
    });
  });

  it("drops clicks and typing (they may name a candidate) and hides tokens in addresses", () => {
    const { beforeBreadcrumb } = options;

    expect(beforeBreadcrumb!({ category: "ui.click", message: "View e-mail to Emma" })).toBeNull();
    expect(
      beforeBreadcrumb!({ category: "navigation", data: { from: "/", to: "/#/opt-out/recA.sig" } })
    ).toMatchObject({ data: { from: "/", to: "/#/opt-out/[token]" } });
  });

  it("is off without a DSN - nothing is loaded in development and tests", () => {
    expect(__SENTRY_DSN__).toBe("");
  });
});
