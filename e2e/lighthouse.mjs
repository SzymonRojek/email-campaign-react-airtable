/**
 * Lighthouse audit of the main screens - the production build with the fake Airtable
 * (like the e2e tests, no real data). Fails when a screen drops below the limits;
 * the HTML reports are saved in e2e/lighthouse-reports/.
 *
 *   npm run test:lighthouse      (after: npm run build)
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import puppeteer from "puppeteer-core";

const { ADMIN_PASSWORD, AIRTABLE_PORT, API_KEY } = await import("./seed.ts");

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const reports = path.join(here, "lighthouse-reports");
// its own port - the e2e tests and a local server can keep running
const APP = "http://localhost:5058";

// every screen, logged out or in
const screens = [
  ["login", "/#/login", false],
  ["dashboard", "/#/", true],
  ["subscribers", "/#/subscribers", true],
  ["campaigns", "/#/campaigns", true],
  ["campaign-details", "/#/campaigns/recCampSent00002", true],
  ["new-campaign", "/#/campaigns/add", true],
  ["feedback", "/#/feedback", true],
];

// the limits (0-100), desktop. Accessibility, best practices and SEO do not vary - they
// must stay at 100. Performance varies from run to run on shared machines (the same screen
// gave 79 and 100), so its limit only catches a real slowdown; the phone results
// (4x slower CPU) are only reported
const limits = { performance: 70, accessibility: 100, "best-practices": 100, seo: 100 };

const start = (args, env = {}) =>
  spawn(args[0], args.slice(1), { cwd: root, env: { ...process.env, ...env }, stdio: "ignore" });

const waitFor = async (url) => {
  for (let i = 0; i < 60; i++) {
    try {
      return await fetch(url);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`${url} did not start`);
};

const servers = [
  start(["npx", "ts-node", "--transpile-only", "e2e/mock-airtable.ts"]),
  start(["node", "server/dist/index.js"], {
    NODE_ENV: "production",
    PORT: "5058",
    ADMIN_PASSWORD,
    AUTH_SECRET: "lighthouse-auth-secret",
    // never the real Airtable - these override the values from .env
    AIRTABLE_API_URL: `http://localhost:${AIRTABLE_PORT}/v0`,
    AIRTABLE_BASE_ID: "appE2E",
    AIRTABLE_TOKEN: API_KEY,
    SENTRY_DSN: "",
  }),
];

let chrome;
let failed = false;

try {
  await waitFor(`http://localhost:${AIRTABLE_PORT}/__db`);
  await fetch(`http://localhost:${AIRTABLE_PORT}/__reset`, { method: "POST" });
  await waitFor(`${APP}/api/health`);
  fs.mkdirSync(reports, { recursive: true });

  chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
  const browser = await puppeteer.connect({ browserURL: `http://localhost:${chrome.port}` });
  const page = await browser.newPage();
  const results = [];

  for (const [name, address, loggedIn] of screens) {
    // the app keeps the login in localStorage: a token from the server + the "login" flag
    await page.goto(`${APP}/#/login`);
    await page.evaluate(() => localStorage.clear());
    if (loggedIn) {
      const response = await fetch(`${APP}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ADMIN_PASSWORD }),
      });
      const { token } = await response.json();
      await page.evaluate((value) => {
        localStorage.setItem("authToken", value);
        localStorage.setItem("login", "true");
      }, token);
    }

    const row = { screen: name };
    for (const [device, config] of [["phone", undefined], ["desktop", desktopConfig]]) {
      const { lhr, report } = await lighthouse(
        `${APP}${address}`,
        { port: chrome.port, disableStorageReset: true, output: "html", logLevel: "error" },
        config,
        page
      );
      fs.writeFileSync(path.join(reports, `${name}-${device}.html`), report);

      const score = (category) => Math.round(lhr.categories[category].score * 100);
      if (device === "phone") {
        row["phone perf"] = score("performance");
        continue;
      }
      for (const [category, limit] of Object.entries(limits)) {
        row[category] = score(category);
        if (score(category) < limit) {
          failed = true;
          row.problem = `${row.problem ? `${row.problem}, ` : ""}${category} ${score(category)} < ${limit}`;
        }
      }
    }
    results.push(row);
  }

  console.table(results);
  console.log(failed ? "Lighthouse: below the limits (see above)" : "Lighthouse: every screen is within the limits");
  await browser.disconnect();
} finally {
  await chrome?.kill();
  servers.forEach((server) => server.kill());
}

process.exit(failed ? 1 : 0);
