import * as Sentry from "@sentry/node";

import { monitoringOptions } from "./helpers/monitoring";

// loaded before anything else (see index.ts) - Sentry has to wrap Express first
if (process.env.SENTRY_DSN) Sentry.init(monitoringOptions());
