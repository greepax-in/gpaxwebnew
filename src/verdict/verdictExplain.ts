// FILE: src/verdict/verdictExplain.ts
// PURPOSE: Human-readable explanation derived from VerdictReport (no logic duplication)

import { VerdictReport, VerdictResult } from "./executeVerdictEngine";

type VerdictExplanation = {
  id: string;
  pillar: string;
  status: string;
  message: string;
};

export function generateVerdictExplain(verdict: VerdictReport | any) {
  // Support both legacy `results` + `status` and new `verdict` + `blocking_rules` shape
  const results: VerdictResult[] = Array.isArray((verdict || {}).results)
    ? verdict.results
    : [];

  // LOCKED: Explain only non-PASS results (projection-only)
  const explanations: VerdictExplanation[] = results
    .filter((r) => r.status !== "PASS")
    .map((r) => ({
      id: r.id,
      pillar: r.pillar,
      status: r.status,
      message: r.reason || "",
    }));

  // NEXT TASK A (LOCKED):
  // If coverage is INCOMPLETE, surface skipped rules explicitly.
  // Derived ONLY from verdict.coverage.missing_rules (no verdict logic duplication).
  const missingRules: string[] = Array.isArray(verdict?.coverage?.missing_rules)
    ? verdict.coverage.missing_rules
    : [];

  if (missingRules.length > 0) {
    // Build a quick lookup to find pillar from existing results (if present).
    const pillarById = new Map<string, string>();
    for (const r of results) pillarById.set(r.id, r.pillar as string);

    const byId = new Map<string, VerdictExplanation>();
    for (const e of explanations) byId.set(e.id, e);

    for (const id of missingRules) {
      const pillar = pillarById.get(id) || "unknown";
      const msg = "Required evidence was not emitted by any validator";

      // If an explanation already exists (e.g., NOT_RUN), upgrade it to NOT_EXECUTED.
      if (byId.has(id)) {
        const existing = byId.get(id)!;
        existing.status = "NOT_EXECUTED";
        existing.message = msg;
      } else {
        explanations.push({
          id,
          pillar,
          status: "NOT_EXECUTED",
          message: msg,
        });
      }
    }
  }

  return {
    contract: verdict.contract,
    verdict: verdict.verdict ?? verdict.status,
    explanations,
    generated_at: verdict.computed_at ?? verdict.generated_at
  };
}
