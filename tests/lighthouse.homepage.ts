// CODEX_PATCH_BEGIN
// FILE: tests/lighthouse.test.ts

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

const BASE_URL = 'http://localhost:3000';

(async () => {
  let chrome: chromeLauncher.LaunchedChrome | null = null;

  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox'],
    });

     const options = {
       logLevel: 'error' as const,
      output: 'json' as const,
      onlyCategories: ['performance', 'seo'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse(BASE_URL, options);

    if (!runnerResult?.lhr) {
      throw new Error('Lighthouse failed to produce a report');
    }

    const { performance, seo } = runnerResult.lhr.categories;

    if (performance.score === null || performance.score < 0.9) {
      throw new Error(
        `❌ Lighthouse Performance score too low: ${performance.score}`
      );
    }
    if (seo.score === null || seo.score < 0.9) {
      throw new Error(
        `❌ Lighthouse SEO score too low: ${seo.score}`
      );
    }
  } catch (err) {
    if (chrome) {
      await chrome.kill();
    }
    throw err;
  }
  if (chrome) {
    await chrome.kill();
  }
})();
