import { test, expect, chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { launch, LaunchedChrome } from 'chrome-launcher';

const BASE_URL = 'http://localhost:3000';
const LIGHTHOUSE_TIMEOUT_MS = 120000;
const SERVER_READY_TIMEOUT_MS = 15000;
const DEFAULT_PERF_THRESHOLD = 0.75;
const DEFAULT_SEO_THRESHOLD = 0.9;

const getNumericEnv = (key: string, fallback: number) => {
  const value = process.env[key];
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const PERFORMANCE_THRESHOLD = getNumericEnv(
  'LH_PERF_THRESHOLD',
  DEFAULT_PERF_THRESHOLD
);
const SEO_THRESHOLD = getNumericEnv('LH_SEO_THRESHOLD', DEFAULT_SEO_THRESHOLD);

async function waitForServer(url: string, timeoutMs: number) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (response.ok) {
        return true;
      }
    } catch {
      // no-op
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return false;
}

test.describe('Lighthouse - Homepage Smoke Test', () => {
  test('Performance and SEO meet baseline thresholds', async () => {
    test.setTimeout(LIGHTHOUSE_TIMEOUT_MS);
    let chrome: LaunchedChrome | null = null;

    try {
      const serverReady = await waitForServer(BASE_URL, SERVER_READY_TIMEOUT_MS);
      if (!serverReady) {
        throw new Error(`Dev server not reachable at ${BASE_URL}`);
      }

      // Use Playwright's bundled Chromium path when available.
      const executablePath =
        chromium.executablePath() ||
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
        process.env.CHROME_PATH;

      chrome = await launch({
        chromePath: executablePath || undefined,
        chromeFlags: ['--headless', '--no-sandbox'],
      });

      const options = {
        logLevel: 'error' as const,
        output: 'json' as const,
        onlyCategories: ['performance', 'seo'],
        port: chrome.port,
      };

      const runnerResult = await lighthouse(BASE_URL, options);

      expect(runnerResult?.lhr).toBeTruthy();

      const { performance, seo } = runnerResult!.lhr.categories;

      // Performance: dev-safe baseline
      expect(performance.score).not.toBeNull();
      expect(performance.score!).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLD);

      // SEO: must remain strong even in dev
      expect(seo.score).not.toBeNull();
      expect(seo.score!).toBeGreaterThanOrEqual(SEO_THRESHOLD);
    } finally {
      if (chrome) {
        await chrome.kill();
      }
    }
  });
});
