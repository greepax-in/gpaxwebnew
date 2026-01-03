import { defineConfig } from "@playwright/test";

export default defineConfig({
  workers: 1,
  timeout: 60_000,

  reporter: [
    ["list"],
    ["json", { outputFile: "reports/contract-results.json" }]
  ],

  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  use: {
    baseURL: "http://localhost:3000",
  },
});
