import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Accept both *.test.ts and *.spec.ts
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],

  timeout: 30 * 1000,
  retries: 0,
  workers: 1,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
  },
});
