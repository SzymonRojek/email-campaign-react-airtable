/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: new RegExp(`^(${srcFolders.join("|").replace(".", "\\.")})(/.*)?$`),
        replacement: `${fileURLToPath(new URL("./src", import.meta.url))}/$1$2`,
      },
    ],
  },
  server: {
    port: 3000,
    // the Express API runs on 5000 in development
    proxy: { "/api": "http://localhost:5000" },
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
