import { pagePattern, trackEvent, trackPage } from "./analytics";

describe("visit statistics", () => {
  it("sends page patterns - no record ids, no unsubscribe tokens", () => {
    expect(pagePattern("/campaigns/recCampSent00002")).toBe("/campaigns/:id");
    expect(pagePattern("/campaigns/edit/recAbc123")).toBe("/campaigns/edit/:id");
    expect(pagePattern("/unsubscribe/recSubAnna000001.sig-NATURE_1")).toBe("/unsubscribe/:token");
    expect(pagePattern("/subscribers")).toBe("/subscribers");
  });

  it("is off without a website id - nothing is loaded or sent in development and tests", () => {
    const track = vi.fn();
    window.umami = { track };

    trackPage("/subscribers");
    trackEvent("login");

    expect(__UMAMI_WEBSITE_ID__).toBe("");
    expect(track).not.toHaveBeenCalled();
    expect(document.querySelector('script[src*="umami"]')).toBeNull();
    delete window.umami;
  });
});
