import type { Page } from "@playwright/test";
import { getJsonLd } from "./text.utils";
import type { SchemaRules } from "./types";
import type { ContractEvidenceContext } from "./contractEvidence";

export async function validateSchema(page: Page, rules: SchemaRules, ctx?: ContractEvidenceContext): Promise<void> {
  const blocks = await getJsonLd(page);

  if (rules.requireOrganization?.enabled) {
    const detectedTypes: string[] = [];

    for (const block of blocks) {
      if (!block || typeof block !== "object") continue;
      const type = (block as { "@type"?: string | string[] })["@type"];
      const types = Array.isArray(type) ? type : type ? [type] : [];
      detectedTypes.push(...types);
    }

    const organizationDetected =
      detectedTypes.includes("Organization") ||
      detectedTypes.includes("LocalBusiness");

    ctx?.emit({
      id: "SCHEMA-01",
      pillar: "schema",
      severity: "error",
      observed: {
        organizationDetected,
        detectedTypes
      },
      expected: {
        types: ["Organization"]
      },
      source: "dom",
      location: "JSON-LD"
    });
  }

  if (rules.forbidProduct?.enabled) {
    const forbiddenTypes = ["Product", "Offer", "AggregateOffer", "ProductGroup"];
    const detectedTypes: string[] = [];

    for (const block of blocks) {
      if (!block || typeof block !== "object") continue;
      const type = (block as { "@type"?: string | string[] })["@type"];
      const types = Array.isArray(type) ? type : type ? [type] : [];
      detectedTypes.push(...types);
    }

    const forbiddenDetected = detectedTypes.some(t =>
      forbiddenTypes.includes(t)
    );

    ctx?.emit({
      id: "SCHEMA-02",
      pillar: "schema",
      severity: "error",
      observed: {
        forbiddenSchemaDetected: forbiddenDetected,
        detectedTypes
      },
      expected: {
        forbidden_types: forbiddenTypes
      },
      source: "dom",
      location: "JSON-LD"
    });
  }
}
