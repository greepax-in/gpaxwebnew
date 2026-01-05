import { defineConfig } from "@playwright/test";

export default defineConfig({
  workers: 1,
  timeout: 60_000,

  reporter: [
    ["list"],
    ["json", { outputFile: "reports/contract-results.json" }]
  ],

  use: {
    baseURL: "http://localhost:3000",
  },
});
