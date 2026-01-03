import { expect, type Page } from "@playwright/test";
import { getJsonLd } from "./text.utils";
import type { SchemaRules } from "./types";
import type { ContractEvidenceContext } from "./contractEvidence";

export async function validateSchema(page: Page, rules: SchemaRules, ctx?: ContractEvidenceContext): Promise<void> {
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

    const hasOrganizationSchema = !!org && !!(org as any).name && !!(org as any).url;
    if (hasOrganizationSchema) {
      ctx?.pass({ id: "SCHEMA-01", pillar: "schema", label: "Organization schema present" });
      ctx?.pass({ id: "SCHEMA-02", pillar: "schema", label: "Organization has name and url" });
    } else {
      ctx?.fail({ id: "SCHEMA-01", pillar: "schema", label: "Organization schema missing or incomplete" });
      ctx?.fail({ id: "SCHEMA-02", pillar: "schema", label: "Organization missing name or url" });
    }
  }

  if (rules.forbidProduct) {
    const product = blocks.find((b: unknown) => {
      if (!b || typeof b !== "object") return false;
      const type = (b as { "@type"?: string | string[] })["@type"];
      return (
        type === "Product" ||
        (Array.isArray(type) && type.includes("Product"))
      );
    });

    if (!product) {
      ctx?.pass({ id: "SCHEMA-04", pillar: "schema", label: "Product schema forbidden on homepage" });
    } else {
      ctx?.fail({ id: "SCHEMA-04", pillar: "schema", label: "Product schema present but forbidden on homepage" });
    }
  }
}
