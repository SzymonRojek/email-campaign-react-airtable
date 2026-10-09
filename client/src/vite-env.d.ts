/// <reference types="vite/client" />

// error monitoring - set at build time from the SENTRY_DSN / SENTRY_ENVIRONMENT variables
declare const __SENTRY_DSN__: string;
declare const __SENTRY_ENVIRONMENT__: string;
