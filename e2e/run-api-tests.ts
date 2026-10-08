/**
 * The Postman collection (postman/) run by Newman against the real server build and the
 * fake Airtable - like the e2e tests, it never touches real data.
 *
 *   npm run test:api            (after: npm run build:server)
 */
import { spawn, ChildProcess } from "child_process";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const newman = require("newman");

import { ADMIN_PASSWORD, AIRTABLE_PORT, API_KEY } from "./seed";

const root = path.resolve(__dirname, "..");
// its own port - the e2e tests and a local server can keep running
const APP_PORT = 5056;

const start = (command: string, args: string[], env: NodeJS.ProcessEnv = {}) =>
  spawn(command, args, { cwd: root, env: { ...process.env, ...env }, stdio: "inherit" });

const waitFor = async (url: string, method = "GET") => {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(url, { method });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`${url} did not start`);
};

const run = (): Promise<boolean> =>
  new Promise((resolve, reject) =>
    newman.run(
      {
        collection: path.join(root, "postman/email-campaign-dashboard.postman_collection.json"),
        envVar: [
          { key: "baseUrl", value: `http://localhost:${APP_PORT}` },
          { key: "password", value: ADMIN_PASSWORD },
        ],
        reporters: ["cli"],
      },
      (error: Error | null, summary: { run: { failures: unknown[] } }) =>
        error ? reject(error) : resolve(summary.run.failures.length === 0)
    )
  );

const main = async () => {
  const servers: ChildProcess[] = [];

  try {
    servers.push(start("npx", ["ts-node", "--transpile-only", "e2e/mock-airtable.ts"]));
    await waitFor(`http://localhost:${AIRTABLE_PORT}/__db`);
    await fetch(`http://localhost:${AIRTABLE_PORT}/__reset`, { method: "POST" });

    servers.push(
      start("node", ["server/dist/index.js"], {
        NODE_ENV: "test",
        PORT: String(APP_PORT),
        ADMIN_PASSWORD,
        AUTH_SECRET: "api-tests-auth-secret",
        // never the real Airtable - these override the values from .env
        AIRTABLE_API_URL: `http://localhost:${AIRTABLE_PORT}/v0`,
        AIRTABLE_BASE_ID: "appE2E",
        AIRTABLE_TOKEN: API_KEY,
        SENTRY_DSN: "",
      })
    );
    await waitFor(`http://localhost:${APP_PORT}/api/health`);

    process.exitCode = (await run()) ? 0 : 1;
  } finally {
    servers.forEach((server) => server.kill());
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
