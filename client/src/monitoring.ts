// error monitoring (Sentry) - on only when the build has a DSN (Render: production, staging);
// never locally or in the tests. The SDK is loaded on demand, so the app is not bigger without it
import type { BrowserOptions, ErrorEvent } from "@sentry/react";

type Sentry = typeof import("@sentry/react");

let sentry: Sentry | null = null;

// the unsubscribe link works without a login - its token must not leave the browser
export const hideSecrets = (text = "") =>
  text.replace(/(unsubscribe\/)[^/?#\s"']+/g, "$1[token]");

const cleanEvent = (event: ErrorEvent) => {
  if (event.request?.url) event.request.url = hideSecrets(event.request.url);
  if (event.transaction) event.transaction = hideSecrets(event.transaction);
  return event;
};

// only what the error needs: where it happened - no personal data
export const monitoringOptions = (dsn: string, environment: string): BrowserOptions => ({
  dsn,
  environment,
  tracesSampleRate: 0,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
  },
  beforeSend: cleanEvent,
  beforeBreadcrumb: (breadcrumb) => {
    // clicks and typing may name a subscriber (e.g. "View e-mail to Emma Johnson")
    if (breadcrumb.category?.startsWith("ui.")) return null;
    if (breadcrumb.message) breadcrumb.message = hideSecrets(breadcrumb.message);
    for (const key of ["url", "from", "to"]) {
      const value = breadcrumb.data?.[key];
      if (typeof value === "string") breadcrumb.data![key] = hideSecrets(value);
    }
    return breadcrumb;
  },
});

export const startMonitoring = async () => {
  if (!__SENTRY_DSN__) return;

  sentry = await import("@sentry/react");
  sentry.init(monitoringOptions(__SENTRY_DSN__, __SENTRY_ENVIRONMENT__));
};

// an error the app caught itself (e.g. a page that failed to render)
export const reportError = (error: unknown) => {
  sentry?.captureException(error);
};
