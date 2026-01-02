import { expect, type Page } from "@playwright/test";
import { getJsonLd } from "./text.utils";
import type { SchemaRules } from "./types";

export async function validateSchema(
  page: Page,
  rules: SchemaRules
): Promise<void> {
  const blocks = await getJsonLd(page);

  if (rules.requireOrganization) {
    const org = blocks.find((b: unknown) => {
      if (!b || typeof b !== "object") return false;
      const type = (b as { "@type"?: string | string[] })["@type"];
      return (
        type === "Organization" ||
        type === "LocalBusiness" ||
        (Array.isArray(type) && type.includes("Organization"))
      );
    });

    expect(org, "Organization schema missing").toBeTruthy();
    expect((org as any).name, "Organization schema missing name").toBeTruthy();
    expect((org as any).url, "Organization schema missing url").toBeTruthy();
  }

  if (rules.forbidProduct) {
    const product = blocks.find((b: unknown) => {
      if (!b || typeof b !== "object") return false;
      const type = (b as { "@type"?: string | string[] })["@type"];
      return type === "Product" || (Array.isArray(type) && type.includes("Product"));
    });
    expect(product).toBeFalsy();
  }
}
