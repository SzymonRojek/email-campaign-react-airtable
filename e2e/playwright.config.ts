import fs from "fs";
import path from "path";
import { defineConfig, devices } from "@playwright/test";

import { ADMIN_PASSWORD, AIRTABLE_PORT, API_KEY, APP_PORT } from "./seed";

const root = path.resolve(__dirname, "..");

// the tests run against the production build (client/build + server/dist)
for (const file of ["client/build/index.html", "server/dist/index.js"]) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(
      `Missing ${file} - build first: npm run build:server && npm run build --prefix client`
    );
  }
}

export default defineConfig({
  testDir: "./tests",
  // all tests share one fake Airtable - run them one by one
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // PW_CHANNEL=chrome uses the installed Google Chrome - e.g. on macOS 12,
        // where Playwright no longer ships its own Chromium
        ...(process.env.PW_CHANNEL && { channel: process.env.PW_CHANNEL }),
      },
    },
  ],
  webServer: [
    {
      command: "npx ts-node --transpile-only e2e/mock-airtable.ts",
      cwd: root,
      port: AIRTABLE_PORT,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "node server/dist/index.js",
      cwd: root,
      port: APP_PORT,
      reuseExistingServer: false,
      env: {
        NODE_ENV: "production",
        PORT: String(APP_PORT),
        ADMIN_PASSWORD,
        AUTH_SECRET: "e2e-auth-secret",
        // never the real Airtable - these override the values from .env
        AIRTABLE_API_URL: `http://localhost:${AIRTABLE_PORT}/v0`,
        AIRTABLE_BASE_ID: "appE2E",
        AIRTABLE_TOKEN: API_KEY,
      },
    },
  ],
});
