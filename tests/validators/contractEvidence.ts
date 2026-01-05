/**
 * Evidence ABI v1.1 — Observation Only
 * ----------------------------------
 * This layer MUST NOT:
 * - decide pass / fail
 * - compare thresholds
 * - emit verdicts or diagnostics
 *
 * It ONLY records what was observed.
 */

export type EvidenceSeverity = "error" | "warn" | "info";

export type EvidenceSource =
  | "dom"
  | "lighthouse"
  | "network"
  | "runtime";

export type EvidenceEntry = {
  /** Stable contract check ID (e.g. SEO-01, PERF-02) */
  id: string;

  /** Logical pillar */
  pillar: "seo" | "schema" | "intent" | "flow" | "performance";

  /** Severity as defined by the Contract (not computed here) */
  severity: EvidenceSeverity;

  /** What was observed — raw, uninterpreted */
  observed: Record<string, unknown>;

  /** Expected contract shape (no comparison allowed here) */
  expected: Record<string, unknown>;

  /** Where the signal came from */
  source: EvidenceSource;

  /** Optional DOM / resource locator */
  location?: string;

  /** ISO timestamp */
  timestamp: string;
};

export type EvidenceEnvelope = {
  abi_version: "1.1";
  page: "homepage";
  generated_at: string;
  evidence: EvidenceEntry[];
};

export class ContractEvidenceContext {
  private readonly evidence: EvidenceEntry[] = [];
  private readonly page: "homepage";

  constructor(page: "homepage" = "homepage") {
    this.page = page;
  }

  /**
   * Emit a single Evidence ABI entry.
   * Validators MUST call this instead of pass/fail/note.
   */
  emit(entry: Omit<EvidenceEntry, "timestamp">) {
    this.assertValid(entry);

    this.evidence.push({
      ...entry,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Return raw evidence entries
   */
  list(): EvidenceEntry[] {
    return [...this.evidence];
  }

  /**
   * Serialize Evidence ABI envelope
   */
  toJSON(): EvidenceEnvelope {
    return {
      abi_version: "1.1",
      page: this.page,
      generated_at: new Date().toISOString(),
      evidence: this.list(),
    };
  }

  /**
   * Runtime ABI guard — fail fast if a validator emits invalid evidence
   */
  private assertValid(entry: Omit<EvidenceEntry, "timestamp">) {
    if (!entry.id) throw new Error("Evidence.id is required");
    if (!entry.pillar) throw new Error(`Evidence ${entry.id}: pillar is required`);
    if (!entry.severity)
      throw new Error(`Evidence ${entry.id}: severity is required`);
    if (!entry.observed)
      throw new Error(`Evidence ${entry.id}: observed is required`);
    if (!entry.expected)
      throw new Error(`Evidence ${entry.id}: expected is required`);
    if (!entry.source)
      throw new Error(`Evidence ${entry.id}: source is required`);

    if (entry.source === "lighthouse" && !entry.location) {
      throw new Error(
        `Evidence ${entry.id}: lighthouse evidence requires location`
      );
    }
  }
}
