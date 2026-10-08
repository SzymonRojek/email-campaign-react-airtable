/// <reference types="vite/client" />

// error monitoring - set at build time from the SENTRY_DSN / SENTRY_ENVIRONMENT variables
declare const __SENTRY_DSN__: string;
declare const __SENTRY_ENVIRONMENT__: string;

// visit statistics (src/analytics.ts) - set at build time from UMAMI_WEBSITE_ID
declare const __UMAMI_WEBSITE_ID__: string;
