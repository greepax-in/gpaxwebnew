import type { Page } from "@playwright/test";

/**
 * Returns normalized visible body text for semantic validators
 */
export async function getBodyText(page: Page): Promise<string> {
  const text = await page.locator("body").innerText();
  return text.toLowerCase();
}

/**
 * Extracts all valid JSON-LD blocks from the page
 */
export async function getJsonLd(page: Page): Promise<unknown[]> {
  return page.$$eval(
    'script[type="application/ld+json"]',
    (nodes) =>
      nodes
        .map((n) => {
          try {
            return JSON.parse(n.textContent || "");
          } catch {
            return null;
          }
        })
        .filter(Boolean)
  );
}
