# Verdict Contract ABI — v1.0

**ABI-ID:** verdict-contract-v1
**Scope:** Homepage (GreenPax.in)
**Purpose:** Deterministically compute a page verdict from Evidence ABI + Homepage Contract ABI.

---

## 1. Core Principle

The Verdict ABI is:
- **Purely deterministic**
- **Side-effect free**
- **Derived only from Evidence ABI + Contract rules**

It MUST NOT:
- Inspect DOM
- Run Lighthouse
- Read source code
- Contain UI or reporting logic

---

## 2. Verdict Levels

Exactly one verdict MUST be produced per page run.

```json
"verdict": "PASS" | "WARNED" | "BLOCKED"
```

### Semantics

| Verdict | Meaning |
|-------|--------|
| PASS | Page satisfies all blocking rules |
| WARNED | Non-blocking deviations exist |
| BLOCKED | At least one blocking rule violated |

---

## 3. Verdict Computation Rules

### 3.1 Blocking Logic

A page is **BLOCKED** if:
- Any **error-severity evidence** maps to a **blocking rule** in the Homepage Contract

```text
IF ∃ evidence.severity == "error" AND rule.blocking == true
→ verdict = BLOCKED
```

---

### 3.2 Warning Logic

A page is **WARNED** if:
- No blocking errors exist
- At least one **warn-severity evidence** exists

```text
IF no BLOCKED
AND ∃ evidence.severity == "warn"
→ verdict = WARNED
```

---

### 3.3 Pass Logic

A page is **PASS** if:
- No error-severity evidence
- No warn-severity evidence

```text
IF ∄ evidence.severity IN ["error", "warn"]
→ verdict = PASS
```

---

## 4. Verdict ABI Schema

```json
{
  "abi_version": "1.0",
  "page": "homepage",
  "verdict": "PASS | WARNED | BLOCKED",
  "blocking_rules": ["FLOW-02", "INTENT-01"],
  "warnings": ["SEO-05", "PERF-INFO-01"],
  "evidence_digest": "sha256-hash",
  "computed_at": "2026-01-05T00:00:00Z"
}
```

---

## 5. Evidence Mapping Requirements

Each verdict MUST reference:

- Evidence IDs (from Evidence ABI)
- Contract rule IDs (from Homepage Contract ABI)

No free-text reasoning is allowed.

---

## 6. Determinism Guarantees

Given:
- Same Homepage Contract ABI
- Same Evidence ABI payload

The Verdict output MUST be:
- Bitwise identical
- Order-independent
- Time-invariant (except `computed_at`)

---

## 7. Explicit Non-Goals

The Verdict ABI does NOT:
- Explain *why* a rule exists
- Provide UX recommendations
- Render UI or HTML
- Perform scoring or weighting

---

## 8. Governance Rules

- Any change to verdict logic requires **ABI v2**
- Contract rule changes do NOT require Verdict ABI changes
- Evidence schema changes do NOT require Verdict ABI changes

---

## 9. Relationship to Other ABIs

```text
Business Context
      ↓
Homepage Contract ABI (what good means)
      ↓
Evidence ABI (what was observed)
      ↓
Verdict ABI (what it means)
      ↓
Report Renderer (how it looks)
```

---

## 10. Status

- Verdict ABI v1.0 is **LOCKED**
- Applies to Homepage only
- Future pages (category, blog, about) reuse this ABI unchanged
