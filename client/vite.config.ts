/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// absolute imports from src (e.g. "components/Table") - the same paths CRA allowed via baseUrl
const srcFolders = [
  "components",
  "contexts",
  "customHooks",
  "data",
  "helpers",
  "img",
  "pages",
  "services",
  "Modals",
  "types",
  "sendEmail",
  "App.css",
];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // error monitoring (src/monitoring.ts): only a build with SENTRY_DSN (Render) reports errors;
  // the DSN only lets the app send errors to Sentry, never read them - it may be public
  define: {
    __SENTRY_DSN__: JSON.stringify(process.env.SENTRY_DSN ?? ""),
    __SENTRY_ENVIRONMENT__: JSON.stringify(process.env.SENTRY_ENVIRONMENT || "production"),
  },
  resolve: {
    alias: [
      // "@/..." - the alias shadcn/ui components use
      { find: /^@\//, replacement: `${fileURLToPath(new URL("./src", import.meta.url))}/` },
      {
        find: new RegExp(`^(${srcFolders.join("|").replace(".", "\\.")})(/.*)?$`),
        replacement: `${fileURLToPath(new URL("./src", import.meta.url))}/$1$2`,
      },
    ],
  },
  server: {
    port: 3000,
    // the Express API runs on 5000 in development; changeOrigin: false keeps the
    // app's address (localhost:3000) in the requests, so the links the server
    // builds (e.g. "Unsubscribe" in an e-mail) lead to the app, not to the API
    proxy: { "/api": { target: "http://localhost:5000", changeOrigin: false } },
  },
  // the server (production) and the e2e tests serve client/build
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    css: false,
  },
});
