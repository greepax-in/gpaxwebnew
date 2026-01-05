
import fs from "fs";
import path from "path";
import crypto from "crypto";

type EvidenceSeverity = "error" | "warn" | "info";
type EvidenceSource = "dom" | "lighthouse" | "runtime";
type EvidencePillar = "intent" | "flow" | "seo" | "schema" | "performance";

export type EvidenceEntry = {
  id: string;
  pillar: EvidencePillar;
  severity: EvidenceSeverity;
  observed: Record<string, any>;
  expected: Record<string, any>;
  source: EvidenceSource;
  location?: string;
  timestamp: string;
};

export type EvidenceReport = {
  page: string;
  evidence: EvidenceEntry[];
};

export type EvidenceContractItem = {
  id: string;
  pillar: EvidencePillar;
  severity: EvidenceSeverity;
  source: EvidenceSource;
  expected: Record<string, any>;
};

export type EvidenceContract = {
  contract: { id: string; version: string };
  required_evidence: EvidenceContractItem[];
};

export type VerdictContract = {
  contract?: { id?: string; version?: string };
  blocking_rule_map?: string[];
  warning_rule_map?: string[];
  policy?: {
    missing_evidence?: Partial<Record<EvidenceSeverity, "FAIL" | "WARN">>;
    substitutions?: Record<string, string[]>;
  };
};

export type VerdictStatus = "PASS" | "WARN" | "FAIL" | "NOT_RUN";

export type VerdictResult = {
  id: string;
  pillar: EvidencePillar;
  severity: EvidenceSeverity;
  status: VerdictStatus;
  source: EvidenceSource;
  observed: Record<string, any>;
  expected: Record<string, any>;
  reason: string;
  evidence_timestamp?: string;
};

export type VerdictReport = {
  contract: { id: string; version: string };
  inputs: {
    evidence_contract_id: string;
    evidence_contract_version: string;
    evidence_file: string;
    verdict_contract_file: string;
  };
  coverage: {
    required: number;
    executed: number;
    missing: number;
    execution_status: "COMPLETE" | "INCOMPLETE";
    missing_rules: string[];
    by_pillar?: Record<string, { required: number; executed: number; missing: number }>;
  };
  status: "PASS" | "WARN" | "FAIL";
  summary: {
    total_required: number;
    passed: number;
    failed: number;
    warned: number;
    missing: number;
  };
  results: VerdictResult[];
  evidence_digest: string;
  computed_at: string;
};

/* =========================================================
   Deterministic helpers
========================================================= */

const PILLAR_ORDER: EvidencePillar[] = ["intent", "flow", "seo", "schema", "performance"];

function sortResults(a: VerdictResult, b: VerdictResult) {
  const pa = PILLAR_ORDER.indexOf(a.pillar);
  const pb = PILLAR_ORDER.indexOf(b.pillar);
  if (pa !== pb) return pa - pb;
  return a.id.localeCompare(b.id);
}

function defaultMissingPolicy(sev: EvidenceSeverity): "FAIL" | "WARN" {
  if (sev === "error") return "FAIL";
  return "WARN";
}

function hasAnyForbiddenTerms(text: string, forbidden: string[]): string[] {
  const hay = (text || "").toLowerCase();
  return forbidden.filter((t) => hay.includes(t.toLowerCase()));
}

/* =========================================================
   Evidence lookup with substitution support
========================================================= */

function indexEvidence(entries: EvidenceEntry[]) {
  const byId = new Map<string, EvidenceEntry[]>();
  for (const e of entries) {
    const list = byId.get(e.id) || [];
    list.push(e);
    byId.set(e.id, list);
  }
  return byId;
}

function pickBestEntry(entries: EvidenceEntry[] | undefined): EvidenceEntry | null {
  if (!entries || entries.length === 0) return null;
  // Deterministic: prefer lighthouse > runtime > dom, then newest timestamp
  const rank = (s: EvidenceSource) => (s === "lighthouse" ? 0 : s === "runtime" ? 1 : 2);
  return [...entries].sort((a, b) => {
    const ra = rank(a.source);
    const rb = rank(b.source);
    if (ra !== rb) return ra - rb;
    return (b.timestamp || "").localeCompare(a.timestamp || "");
  })[0];
}

function resolveEvidenceForId(
  id: string,
  byId: Map<string, EvidenceEntry[]>,
  substitutions: Record<string, string[]>
): { entry: EvidenceEntry | null; usedId: string } {
  const direct = pickBestEntry(byId.get(id));
  if (direct) return { entry: direct, usedId: id };

  const subs = substitutions[id] || [];
  for (const subId of subs) {
    const sub = pickBestEntry(byId.get(subId));
    if (sub) return { entry: sub, usedId: subId };
  }

  return { entry: null, usedId: id };
}

/* =========================================================
   Evaluators (contract-driven, id-specific)
   - Only reads observed/expected and produces PASS/FAIL/WARN
========================================================= */

function evaluateEntry(id: string, entry: EvidenceEntry, contractExpected: Record<string, any>): { status: VerdictStatus; reason: string } {
  switch (id) {
    // ---------- INTENT ----------
    case "INTENT-01": {
      // Manufacturer / bulk intent via keywords
      const expected: string[] = contractExpected.keywords || [];
      const matched: string[] = entry.observed?.matchedKeywords || [];

      const ok = expected.every((k) =>
        matched.map((m) => m.toLowerCase()).includes(k.toLowerCase())
      );

      return {
        status: ok ? "PASS" : "FAIL",
        reason: ok
          ? "Manufacturer intent keywords present"
          : `Missing intent keywords: ${expected
              .filter(
                (k) =>
                  !matched
                    .map((m) => m.toLowerCase())
                    .includes(k.toLowerCase())
              )
              .join(", ")}`
      };
    }

    case "INTENT-02": {
      // India / locale assertion
      const ok = entry.observed?.hasIndiaContext === true;

      return {
        status: ok ? "PASS" : "FAIL",
        reason: ok
          ? "India business context clearly established"
          : "India context not detected"
      };
    }

    case "INTENT-03": {
      // Ecommerce language must NOT exist
      const ok = entry.observed?.hasEcommerceLanguage === false;

      return {
        status: ok ? "PASS" : "FAIL",
        reason: ok
          ? "No ecommerce language detected"
          : "Ecommerce language detected on manufacturer homepage"
      };
    }

    // ---------- FLOW / CTA ----------
    case "FLOW-01": {
      const heroIndex = entry.observed?.heroDomIndex;
      const ctaIndex = entry.observed?.ctaDomIndex;
      if (typeof heroIndex !== "number" || typeof ctaIndex !== "number") {
        return { status: "WARN", reason: "Could not compute DOM order (missing indices)" };
      }
      const ok = heroIndex >= 0 && ctaIndex >= 0 && heroIndex < ctaIndex;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "Hero appears before CTA" : "CTA appears before hero" };
    }

    case "FLOW-02": {
      const trustIndex = entry.observed?.trustDomIndex;
      const ctaIndex = entry.observed?.ctaDomIndex;
      if (typeof trustIndex !== "number" || typeof ctaIndex !== "number") {
        return { status: "WARN", reason: "Could not compute trust vs CTA order (missing indices)" };
      }
      const ok = trustIndex >= 0 && ctaIndex >= 0 && trustIndex <= ctaIndex;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "Trust appears before or with CTA" : "Trust appears after CTA" };
    }

    case "CTA-01": {
      // Backward/forward compatible: older emitters used aboveFoldCTAcount
      const count =
        typeof entry.observed?.aboveFoldCount === "number"
          ? entry.observed.aboveFoldCount
          : entry.observed?.aboveFoldCTAcount;
      const max = contractExpected.max_count ?? 1;
      if (typeof count !== "number") return { status: "WARN", reason: "CTA count not observed" };
      const ok = count <= max;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "Primary WhatsApp CTA count within limit" : `Too many above-fold CTAs (${count} > ${max})` };
    }

    case "CTA-02": {
      const ctaText: string = entry.observed?.ctaText || "";
      const forbidden: string[] = contractExpected.forbidden_terms || [];
      const found = hasAnyForbiddenTerms(ctaText, forbidden);
      const ok = found.length === 0;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "CTA language non-transactional" : `Forbidden terms found: ${found.join(", ")}` };
    }

    // ---------- SEO ----------
    case "SEO-01": {
      const len = entry.observed?.length;
      const min = contractExpected.min;
      const max = contractExpected.max;
      if (typeof len !== "number") return { status: "WARN", reason: "Title length not observed" };
      const ok = typeof min === "number" && typeof max === "number" ? len >= min && len <= max : len > 0;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "Title length within range" : `Title length out of range (${len})` };
    }

    case "SEO-02": {
      const len = entry.observed?.length;
      const min = contractExpected.min;
      const max = contractExpected.max;
      if (typeof len !== "number") return { status: "WARN", reason: "Meta description length not observed" };
      const ok = typeof min === "number" && typeof max === "number" ? len >= min && len <= max : len > 0;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "Meta description length within range" : `Meta description length out of range (${len})` };
    }

    case "SEO-03": {
      const count = entry.observed?.h1Count;
      const expectedCount = contractExpected.count ?? 1;
      if (typeof count !== "number") return { status: "WARN", reason: "H1 count not observed" };
      const ok = count === expectedCount;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "Single H1 present" : `H1 count mismatch (${count} != ${expectedCount})` };
    }

    case "SEO-04": {
      const present = entry.observed?.present;
      if (typeof present !== "boolean") return { status: "WARN", reason: "Canonical presence not observed" };
      const ok = present === true;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "Canonical present" : "Canonical missing" };
    }

    // ---------- SCHEMA ----------
    case "SCHEMA-01": {
      const detected = entry.observed?.organizationDetected;
      if (typeof detected !== "boolean") return { status: "WARN", reason: "Organization detection not observed" };
      return { status: detected ? "PASS" : "FAIL", reason: detected ? "Organization schema detected" : "Organization schema not detected" };
    }

    case "SCHEMA-02": {
      const forbiddenDetected = entry.observed?.forbiddenSchemaDetected;
      if (typeof forbiddenDetected !== "boolean") return { status: "WARN", reason: "Forbidden schema detection not observed" };
      return { status: forbiddenDetected ? "FAIL" : "PASS", reason: forbiddenDetected ? "Forbidden ecommerce schema detected" : "No forbidden ecommerce schema detected" };
    }

    // ---------- PERFORMANCE (policy based) ----------
    case "PERF-01": {
      // CLS: compare only if numeric observed exists; otherwise WARN/NOT_RUN handled elsewhere
      const cls = entry.observed?.cls;
      const max = contractExpected.max;
      if (typeof cls !== "number") return { status: "WARN", reason: "CLS not observed" };
      if (typeof max !== "number") return { status: "WARN", reason: "CLS max not defined in contract" };
      const ok = cls <= max;
      return { status: ok ? "PASS" : "FAIL", reason: ok ? "CLS within budget" : `CLS exceeded (${cls} > ${max})` };
    }

    case "PERF-02": {
      // PERF-02 MUST evaluate BOTH:
      // 1) Timing (LCP ms) vs contractExpected.max
      // 2) Element policy: forbid image-based LCP on mobile (and optionally desktop)

      const lcpMs =
        typeof entry.observed?.lcpMs === "number"
          ? entry.observed.lcpMs
          : typeof entry.observed?.lcp === "number"
          ? entry.observed.lcp
          : null;

      const max =
        typeof contractExpected.max === "number" ? contractExpected.max : null;

      const tag = (entry.observed?.elementTag || entry.observed?.lcpElementTag || "").toUpperCase();
      const forbidden: string[] = Array.isArray(contractExpected.element_type_forbidden)
        ? contractExpected.element_type_forbidden
        : ["IMG", "PICTURE", "SVG"];

      // If we can't observe LCP timing, we can't enforce performance policy.
      if (lcpMs === null) {
        return { status: "WARN", reason: "LCP timing not observed" };
      }
      if (max === null) {
        return { status: "WARN", reason: "LCP max threshold missing from contract" };
      }

      // Policy gate: forbid image-based LCP when policy requires text-first
      if (tag && forbidden.map((t) => String(t).toUpperCase()).includes(tag)) {
        // This is a policy violation, treat as FAIL (even if rule severity is warn)
        return { status: "FAIL", reason: `LCP element type is forbidden (${tag})` };
      }

      // Timing gate: slow LCP should never be silently ignored
      if (lcpMs > max) {
        // Keep as WARN for now (severity=warn in contract). You can promote to FAIL later by contract.
        return { status: "WARN", reason: `LCP exceeded (${Math.round(lcpMs)}ms > ${Math.round(max)}ms)` };
      }

      return {
        status: "PASS",
        reason: tag ? "LCP within budget and policy satisfied" : "LCP within budget",
      };
    }

    default:
      return { status: "WARN", reason: "No evaluator implemented for this evidence id (treating as observational)" };
  }
}

/* =========================================================
   Public API
========================================================= */

export function runVerdictEngine(args: {
  evidenceContractPath: string;
  evidenceReportPath: string;
  verdictContractPath: string;
}): VerdictReport {
  const evidenceContract = JSON.parse(fs.readFileSync(args.evidenceContractPath, "utf8")) as EvidenceContract;
  const evidenceReport = JSON.parse(fs.readFileSync(args.evidenceReportPath, "utf8")) as EvidenceReport;

  const verdictContract: VerdictContract = fs.existsSync(args.verdictContractPath)
    ? (JSON.parse(fs.readFileSync(args.verdictContractPath, "utf8")) as VerdictContract)
    : {};
    

  const substitutions = verdictContract.policy?.substitutions || {};
  const missingPolicy = verdictContract.policy?.missing_evidence || {};

  const byId = indexEvidence(evidenceReport.evidence || []);

  const results: VerdictResult[] = [];
  const missingRules: string[] = [];

  for (const req of evidenceContract.required_evidence) {
    const { entry, usedId } = resolveEvidenceForId(req.id, byId, substitutions);

    if (!entry) {
      missingRules.push(req.id);
      const missingOutcome = (missingPolicy[req.severity] || defaultMissingPolicy(req.severity));
      results.push({
        id: req.id,
        pillar: req.pillar,
        severity: req.severity,
        status: "NOT_RUN",
        source: req.source,
        observed: { missing: true, tried: [req.id, ...(substitutions[req.id] || [])] },
        expected: req.expected || {},
        reason: missingOutcome === "FAIL" ? "Required evidence missing" : "Evidence missing (treated as warning by policy)"
      });
      continue;
    }

    // If we substituted (e.g., PERF-01 ← PERF-RUNTIME-01), evaluate against the required id semantics
    const { status, reason } = evaluateEntry(req.id, entry, req.expected || {});

    results.push({
      id: req.id,
      pillar: req.pillar,
      severity: req.severity,
      status,
      source: entry.source,
      observed: entry.observed || {},
      expected: req.expected || {},
      reason: usedId === req.id ? reason : `${reason} (substituted from ${usedId})`,
      evidence_timestamp: entry.timestamp
    });
  }

  // Deterministic sort
  results.sort(sortResults);

  // --------------------------------------------------
  // NEXT TASK B (LOCKED): Per-pillar coverage stats
  // Strictly based on evidenceContract.required_evidence (authoritative list)
  // and missingRules (computed by this engine). No heuristics.
  // --------------------------------------------------
  const missingSet = new Set<string>(missingRules);
  const byPillar: Record<string, { required: number; executed: number; missing: number }> = {};
  for (const req of evidenceContract.required_evidence) {
    const pillar = req.pillar || "unknown";
    if (!byPillar[pillar]) byPillar[pillar] = { required: 0, executed: 0, missing: 0 };
    byPillar[pillar].required += 1;
    if (missingSet.has(req.id)) byPillar[pillar].missing += 1;
    else byPillar[pillar].executed += 1;
  }

  const blockingRuleSet = new Set(verdictContract.blocking_rule_map || []);
  const warningRuleSet = new Set(verdictContract.warning_rule_map || []);

  const blocking_rules = results
    .filter((r) => r.status === "FAIL" && blockingRuleSet.has(r.id))
    .map((r) => r.id);

  const warnings = results
    .filter((r) => (r.status === "FAIL" || r.status === "WARN") && warningRuleSet.has(r.id))
    .map((r) => r.id);
  const passes = results.filter((r) => r.status === "PASS").length;
  const fails = results.filter((r) => r.status === "FAIL").length;
  const warns = results.filter((r) => r.status === "WARN").length;
  const missing = results.filter((r) => r.status === "NOT_RUN").length;

  const coverage = {
    required: evidenceContract.required_evidence.length,
    executed: evidenceContract.required_evidence.length - missingRules.length,
    missing: missingRules.length,
    execution_status: missingRules.length === 0 ? "COMPLETE" as const : "INCOMPLETE" as const,
    missing_rules: missingRules,
    by_pillar: byPillar,
  };

  // Overall status:
  // - any FAIL → FAIL
  // - else any WARN or NOT_RUN or INCOMPLETE coverage → WARN
  // - else PASS
  const overall: "PASS" | "WARN" | "FAIL" =
    fails > 0
      ? "FAIL"
      : (warns > 0 || missing > 0 || coverage.execution_status === "INCOMPLETE")
        ? "WARN"
        : "PASS";

  const evidenceDigest = crypto
    .createHash("sha256")
    .update(JSON.stringify(evidenceReport.evidence || []))
    .digest("hex");

  return {
    contract: {
      id: verdictContract.contract?.id || "greenpax-homepage-verdict",
      version: verdictContract.contract?.version || "1.0.0"
    },
    inputs: {
      evidence_contract_id: evidenceContract.contract.id,
      evidence_contract_version: evidenceContract.contract.version,
      evidence_file: args.evidenceReportPath,
      verdict_contract_file: args.verdictContractPath
    },
    coverage,
    status: overall,
    summary: {
      total_required: evidenceContract.required_evidence.length,
      passed: passes,
      failed: fails,
      warned: warns,
      missing
    },
    results,
    evidence_digest: evidenceDigest,
    computed_at: new Date().toISOString()
  };
}


