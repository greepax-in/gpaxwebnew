// CODEX_PATCH_BEGIN
// FILE: src/lib/productSubtitle.ts

type Industry =
  | "retail"
  | "bakery"
  | "food"
  | "qsr"
  | "medical"
  | "pharmaceutical"
  | "fashion";

type UseCase =
  | "packaging"
  | "delivery"
  | "food-wrapping"
  | "takeaway"
  | "branding"
  | "custom-packaging"
  | "wrapping"
  | "gifting";

const INDUSTRY_MAP: Record<Industry, string> = {
  retail: "retail stores",
  bakery: "bakeries",
  food: "food brands",
  qsr: "QSR brands",
  medical: "medical use",
  pharmaceutical: "pharma use",
  fashion: "fashion retailers",
};

const USE_CASE_PRIORITY: UseCase[] = [
  "food-wrapping",
  "delivery",
  "takeaway",
  "branding",
  "custom-packaging",
  "wrapping",
  "gifting",
  "packaging",
];

function resolveIndustry(industries: Industry[] = []): string {
  if (industries.length === 0) return "businesses";
  if (industries.length === 1) {
    const label = INDUSTRY_MAP[industries[0]] ?? "businesses";
    return label.replace("stores", "brands");
  }
  if (industries.length === 2) {
    return `${INDUSTRY_MAP[industries[0]]} & ${INDUSTRY_MAP[industries[1]]}`.replace(
      "stores",
      "brands"
    );
  }
  return "brands";
}

function resolvePrimaryUseCase(useCases: UseCase[] = []): UseCase | null {
  for (const key of USE_CASE_PRIORITY) {
    if (useCases.includes(key)) return key;
  }
  return null;
}

function buildQualifier(
  foodSafe: boolean,
  variantType?: string
): string {
  if (foodSafe) return "food-safe daily packaging";
  if (variantType === "plain") return "cost-efficient packaging";
  return "daily-use packaging";
}

function buildOutcome(
  primaryUseCase: UseCase | null,
  variantType?: string,
  industries: Industry[] = []
): string {
  if (industries.includes("food") || industries.includes("qsr")) {
    return "delivery-ready";
  }

  if (variantType === "printed") {
    return "branding-ready";
  }

  if (variantType === "multicolor") {
    return "high-visibility";
  }

  if (primaryUseCase === "takeaway") {
    return "takeaway-ready";
  }

  if (primaryUseCase === "gifting") {
    return "premium-ready";
  }

  return "bulk-ready";
}

export function buildProductSubtitle(item: any): string {
  const industries: Industry[] = item?.taxonomy?.industries ?? [];
  const useCases: UseCase[] = item?.taxonomy?.useCases ?? [];
  const foodSafe = item?.material?.foodSafe === true;
  const variantType = item?.variant?.type;

  const category = item?.categorySlug;

  const industryPhrase = resolveIndustry(industries);
  let useCasePhrase = buildQualifier(foodSafe, variantType);

  if (foodSafe) {
    useCasePhrase = useCasePhrase.replace("daily ", "");
    if (!useCasePhrase.includes("food")) {
      useCasePhrase = `food-safe ${useCasePhrase}`;
    }
  }

  const parts: string[] = [`For ${industryPhrase}`, useCasePhrase];

  if (category === "paper-bags" && useCases.includes("delivery")) {
    parts.push("delivery-ready");
  } else if (category === "paper-covers") {
    parts.push("bulk-ready");
  } else if (variantType === "printed") {
    parts.push("branding-ready");
  } else if (variantType === "multicolor") {
    parts.push("high-visibility");
  }

  return parts.slice(0, 3).join(" • ");
}

// CODEX_PATCH_END
