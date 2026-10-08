import { hideSecrets, monitoringOptions } from "./monitoring";

describe("error monitoring", () => {
  const options = monitoringOptions("https://key@sentry.example/1", "staging");

  it("never sends the unsubscribe token", () => {
    expect(hideSecrets("https://app.example.com/#/unsubscribe/recAnna.abc-DEF_1")).toBe(
      "https://app.example.com/#/unsubscribe/[token]"
    );
    expect(hideSecrets("https://app.example.com/#/campaigns/rec1")).toBe(
      "https://app.example.com/#/campaigns/rec1"
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

  it("drops clicks and typing (they may name a subscriber) and hides tokens in addresses", () => {
    const { beforeBreadcrumb } = options;

    expect(beforeBreadcrumb!({ category: "ui.click", message: "View the e-mail to Emma" })).toBeNull();
    expect(
      beforeBreadcrumb!({ category: "navigation", data: { from: "/", to: "/#/unsubscribe/recA.sig" } })
    ).toMatchObject({ data: { from: "/", to: "/#/unsubscribe/[token]" } });
  });

  it("is off without a DSN - nothing is loaded in development and tests", () => {
    expect(__SENTRY_DSN__).toBe("");
  });
});
