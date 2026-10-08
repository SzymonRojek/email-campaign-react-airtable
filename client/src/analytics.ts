// visit statistics (Umami Cloud, free "Hobby" plan) - only in a build with UMAMI_WEBSITE_ID
// (production on Render); never locally, in tests or on staging. Anonymous and cookie-free.
// Pages are sent as patterns ("/campaigns/:id") - no record ids, no unsubscribe tokens.

interface Umami {
  track: (payload?: unknown, data?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

// the events counted in the statistics - what a visitor really tried
export type AnalyticsEvent = "login" | "campaign-sent" | "subscribers-imported" | "feedback-sent";

const SCRIPT_URL = "https://cloud.umami.is/script.js";

// calls made before the script has loaded - sent as soon as it is ready
let waiting: ((umami: Umami) => void)[] = [];

const withUmami = (call: (umami: Umami) => void) => {
  if (!__UMAMI_WEBSITE_ID__) return;
  if (window.umami) call(window.umami);
  else waiting.push(call);
};

// "/campaigns/rec1abc?x" -> "/campaigns/:id"; "/unsubscribe/<token>" -> "/unsubscribe/:token"
export const pagePattern = (path: string) =>
  path
    .replace(/\/unsubscribe\/[^/?#]+/, "/unsubscribe/:token")
    .replace(/\/rec[A-Za-z0-9]+/g, "/:id");

export const startAnalytics = () => {
  if (!__UMAMI_WEBSITE_ID__) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = SCRIPT_URL;
  script.dataset.websiteId = __UMAMI_WEBSITE_ID__;
  // the pages are sent by trackPage - the app's addresses live after the "#"
  script.dataset.autoPageview = "false";
  script.dataset.doNotTrack = "true";
  script.onload = () => {
    if (window.umami) waiting.forEach((call) => call(window.umami as Umami));
    waiting = [];
  };
  document.head.appendChild(script);
};

// one page of the app; the real query ("?utm_source=linkedin") tells where the visit came from
export const trackPage = (path: string) =>
  withUmami((umami) =>
    umami.track((props: Record<string, unknown>) => ({
      ...props,
      url: `${pagePattern(path)}${window.location.search}`,
      title: document.title,
    }))
  );

export const trackEvent = (name: AnalyticsEvent) => withUmami((umami) => umami.track(name));
