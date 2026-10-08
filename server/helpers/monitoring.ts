import type { ErrorEvent, NodeOptions } from "@sentry/node";

// error monitoring (Sentry) - on only where SENTRY_DSN is set (Render); never locally or in tests

// the unsubscribe link works without a login - its token must not leave the server
export const hideSecrets = (text = "") =>
  text.replace(/(unsubscribe\/)[^/?#\s"']+/g, "$1[token]");

const cleanEvent = (event: ErrorEvent) => {
  if (event.request?.url) event.request.url = hideSecrets(event.request.url);
  if (event.transaction) event.transaction = hideSecrets(event.transaction);
  event.breadcrumbs?.forEach((breadcrumb) => {
    if (breadcrumb.message) breadcrumb.message = hideSecrets(breadcrumb.message);
    if (typeof breadcrumb.data?.url === "string") breadcrumb.data.url = hideSecrets(breadcrumb.data.url);
  });
  return event;
};

// only what the error needs: where it happened - no personal data, headers, bodies or variables
export const monitoringOptions = (): NodeOptions => ({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || "production",
  tracesSampleRate: 0,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    stackFrameVariables: false,
  },
  beforeSend: cleanEvent,
});
