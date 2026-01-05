# ABI — Evidence Contract (v1.0)

<!--
ABI-Name: GreenPax Evidence ABI
ABI-ID: greenpax.evidence.v1
Version: 1.0.0
Status: LOCKED
Owner: Governance
Depends-On:
  - greenpax.business_context.v1
  - greenpax.homepage_contract.v1
-->

## 1. Purpose (Authoritative)

This ABI defines **the only allowed structure for evidence** emitted by validators.

Evidence is **observational**, never judgmental.

Validators:
- MUST emit evidence conforming to this ABI
- MUST NOT compute verdicts
- MUST NOT block or pass pages

Verdicts are computed later by a deterministic verdict engine.

---

## 2. Evidence Philosophy (Non‑Negotiable)

Evidence answers:
> "What was observed on the page?"

Evidence does NOT answer:
- Is this good or bad overall?
- Should the page pass or fail?

---

## 3. Evidence Object (Canonical Shape)

```json
{
  "id": "SEO-01",
  "pillar": "seo",
  "rule": "Homepage title length <= 60 characters",
  "severity": "error",
  "result": "pass",
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

## 4. Required Fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Stable rule identifier (e.g. SEO‑01, FLOW‑02) |
| `pillar` | enum | seo, schema, intent, flow, performance |
| `rule` | string | Human‑readable rule description |
| `severity` | enum | error, warn, info |
| `result` | enum | pass, fail, not_run |
| `observed` | object | Raw observed facts |
| `expected` | object | Contract expectations |
| `source` | enum | dom, lighthouse, network, runtime |
| `location` | string | DOM path, metric name, or artifact reference |
| `timestamp` | string (ISO‑8601) | Observation time |

---

## 5. Allowed Enums

### 5.1 Pillar

```json
["seo", "schema", "intent", "flow", "performance"]
```

### 5.2 Severity

```json
["error", "warn", "info"]
```

### 5.3 Result

```json
["pass", "fail", "not_run"]
```

### 5.4 Source

```json
["dom", "lighthouse", "network", "runtime"]
```

---

## 6. Evidence Rules

Validators:
- MUST emit **one evidence entry per rule**
- MUST emit evidence even if rule cannot be evaluated (`result: not_run`)
- MUST NOT omit failed rules
- MUST NOT infer intent or verdict

Evidence:
- MUST be serializable JSON
- MUST NOT contain functions or class instances
- MUST NOT reference UI components or code paths

---

## 7. Forbidden Patterns (Hard Fail)

❌ Verdict fields inside evidence
❌ Boolean `passed: true/false`
❌ Nested evidence blocks
❌ UI‑derived labels ("Good", "Bad")
❌ Business language inside evidence

---

## 8. Example — Performance Evidence

```json
{
  "id": "PERF-01",
  "pillar": "performance",
  "rule": "CLS <= 0.1",
  "severity": "error",
  "result": "pass",
  "observed": { "cls": 0.02 },
  "expected": { "max": 0.1 },
  "source": "lighthouse",
  "location": "CLS",
  "timestamp": "2026-01-05T00:00:00Z"
}
```

---

## 9. Compatibility & Evolution

- Evidence ABI is **append‑only**
- New fields must be optional
- Breaking changes require `v2`

---

## 10. Lock Statement

This ABI is **LOCKED**.

All validators must conform.
All verdict engines must consume only this shape.

Any evidence not matching this ABI is **invalid and must be rejected**.

