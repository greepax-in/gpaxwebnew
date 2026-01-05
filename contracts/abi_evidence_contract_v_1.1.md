# Evidence ABI — v1.1 (Corrected, Strict)

**ABI-Name:** GreenPax Evidence ABI  
**ABI-ID:** greenpax.evidence.v1.1  
**Version:** 1.1.0  
**Status:** 🔒 LOCKED  
**Owner:** Governance  
**Depends-On:**  
- greenpax.business_context.v1  
- greenpax.homepage_contract.v1

---

## 1. Purpose (Authoritative)

This ABI defines the **only allowed structure** for evidence emitted by validators.

Evidence is:
- **observational**
- **non-judgmental**
- **verdict-agnostic**

Validators:
- MUST emit evidence conforming to this ABI
- MUST NOT compute verdicts
- MUST NOT emit PASS / FAIL semantics

Verdicts are computed **only** by the Verdict ABI.

---

## 2. Evidence Philosophy (Non‑Negotiable)

Evidence answers:
> **"What was observed on the page?"**

Evidence does NOT answer:
- Did the page pass?
- Is this acceptable overall?
- Should production be blocked?

---

## 3. Evidence Envelope (Top‑Level)

Each run MUST produce exactly one Evidence payload.

```json
{
  "abi_version": "1.1",
  "page": "homepage",
  "run_id": "uuid-or-hash",
  "generated_at": "ISO-8601 timestamp",
  "evidence": [ /* EvidenceEntry[] */ ]
}
```

---

## 4. EvidenceEntry (Canonical Unit)

Each EvidenceEntry represents **one observed fact**, never a judgment.

```json
{
  "id": "SEO-01",
  "pillar": "seo",
  "rule": "Homepage title length",
  "severity": "error",

  "observed": {
    "value": "GreenPax | Eco‑Friendly Paper Packaging Manufacturer, India",
    "length": 58
  },

  "expected": {
    "max_length": 60
  },

  "source": "dom",
  "location": "<head><title>",
  "timestamp": "2026-01-05T00:00:00Z"
}
```

---

## 5. Required Fields

| Field | Type | Description |
|------|------|-------------|
| `id` | string | Stable rule identifier (e.g. SEO‑01, FLOW‑02) |
| `pillar` | enum | seo, schema, intent, flow, performance |
| `rule` | string | Human‑readable rule name (not verdict) |
| `severity` | enum | error, warn, info |
| `observed` | object | Raw observed facts only |
| `expected` | object | Contract expectations |
| `source` | enum | dom, lighthouse, network, runtime |
| `location` | string | DOM path, metric name, or artifact reference |
| `timestamp` | string (ISO‑8601) | Observation time |

---

## 6. Explicitly Forbidden Fields (v1.0 Cleanup)

The following fields are **FORBIDDEN** and MUST NOT appear:

```text
result
pass / fail / not_run
score
weight
passed: true|false
verdict
```

Rationale:
- These are **Verdict ABI concerns**, not Evidence ABI concerns.

---

## 7. Allowed Enums

### 7.1 Pillar
```json
["seo", "schema", "intent", "flow", "performance"]
```

### 7.2 Severity
```json
["error", "warn", "info"]
```

### 7.3 Source
```json
["dom", "lighthouse", "network", "runtime"]
```

---

## 8. Evidence Emission Rules

Validators:
- MUST emit **exactly one EvidenceEntry per rule**
- MUST emit evidence even when observation is partial or inconclusive
- MUST express non‑observability via the `observed` object (not via result)
- MUST NOT suppress missing or problematic data

---

## 9. Example — Performance Evidence (CLS)

```json
{
  "id": "PERF-02",
  "pillar": "performance",
  "rule": "Cumulative Layout Shift",
  "severity": "error",
  "observed": { "cls": 0.02 },
  "expected": { "max": 0.1 },
  "source": "lighthouse",
  "location": "CLS",
  "timestamp": "2026-01-05T00:00:00Z"
}
```

---

## 10. Compatibility & Evolution

- Evidence ABI is **append‑only**
- New fields must be optional
- Breaking changes require `v2`

---

## 11. Lock Statement

This ABI is **LOCKED**.

All validators MUST conform.
All verdict engines MUST consume only this shape.

Any evidence not matching this ABI MUST be rejected.

