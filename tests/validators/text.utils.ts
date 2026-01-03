import type { Page } from "@playwright/test";

/**
 * Returns normalized visible body text for semantic validators
 */
export async function getBodyText(page: Page): Promise<string> {
  const text = await page.locator("body").innerText();
  return text.toLowerCase();
}

/**
 * Extracts and NORMALIZES all JSON-LD nodes from the page.
 * - Flattens @graph
 * - Supports arrays
 * - Supports multiple script blocks
 *
 * This matches Google JSON-LD ingestion behavior.
 */
export async function getJsonLd(page: Page): Promise<unknown[]> {
  return page.$$eval(
    'script[type="application/ld+json"]',
    (nodes) => {
      const collected: unknown[] = [];

      for (const n of nodes) {
        if (!n.textContent) continue;

        try {
          const json = JSON.parse(n.textContent);

          // Case 1: Top-level array
          if (Array.isArray(json)) {
            collected.push(...json);
            continue;
          }

          // Case 2: @graph (MOST IMPORTANT)
          if (
            typeof json === "object" &&
            json !== null &&
            "@graph" in json &&
            Array.isArray((json as any)["@graph"])
          ) {
            collected.push(...(json as any)["@graph"]);
            continue;
          }

          // Case 3: Single object
          if (typeof json === "object" && json !== null) {
            collected.push(json);
          }
        } catch {
          // ignore invalid JSON-LD blocks
        }
      }

      return collected;
    }
  );
}
