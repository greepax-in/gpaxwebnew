# GreenPax Governance Refactor Strategy v1.0

**Status:** Draft (Authoritative direction, implementation pending)

**Purpose:** Establish a Google-first, mobile-authoritative governance pipeline for GreenPax.in, using Apple.com execution principles (rendering discipline) as the implementation reference. Homepage-first, scalable to the entire site.

---

## 1. Authoritative Business Context (Frozen Input)

GreenPax.in is an **eco-friendly paper packaging manufacturer based in India**.

- Manufactures **paper bags, paper covers, paper boxes** in **bulk quantities** for commercial use.
- GreenPax is a **manufacturer**, not:
  - marketplace
  - reseller
  - D2C ecommerce brand
- No checkout/cart flow.
- No retail pricing flow.

### Primary Audience (Search Intent)
B2B commercial-intent users:
- Food delivery brands
- Retail chains
- Grocery & FMCG distributors
- Packaging procurement teams
- Business owners sourcing bulk packaging

Common queries:
- “paper bag manufacturer in India”
- “bulk paper packaging supplier”
- “custom paper bags wholesale”
- “eco friendly paper covers manufacturer”

### Primary Conversion Goal
Only primary conversion is **direct contact via WhatsApp / enquiry**.

Rules:
- WhatsApp CTA must be visible.
- CTA must be **non-aggressive**.
- CTA must appear **with/after trust signals**.
- Repeated/sales-heavy CTAs reduce trust.
- No buy-now / cart / price-comparison behavior.

**Output artifact (ABI-locked):** `business_context.json`

---

## 2. End-to-End Governance Flow (Revised)

### Context → Contract → Design → Develop → Run → Validate → Evidence → Verdict → Report

This flow ensures:
- Google-evaluation alignment (intent + trust + structure + crawlability + performance signals)
- Apple execution discipline (fast perceived speed, stable rendering, message before media)
- Deterministic governance outputs (no report-driven truth)

---

## 3. Strict ABI Scope (What is Frozen vs Flexible)

### Strict ABI applies to (freeze now)
- **Business context** (inputs)
- **Contract specs** (rules)
- **Evidence schema** (validator output)
- **Verdict computation** (pass/warn/fail rules)
- **Report inputs** (must render from evidence only)

### Strict ABI does NOT apply to (keep flexible)
- UI markup structure beyond stable hooks
- CSS classes and component composition
- Section layout evolution

**Reason:** Apple discipline is achieved by constraints and stable anchors, not by freezing HTML.

---

## 4. Contract Model (Tiered)

### Tier A — Template Contracts (Authoritative)
Contracts defined per template type. Homepage is the first milestone.

Template types (site-scalable):
1. Homepage
2. Category
3. Subcategory
4. Product-like page
5. Blog index
6. Blog post
7. About
8. Contact
9. Legal

### Tier B — Negative Drift Guards (Always-on)
Guards run across templates to prevent the site from drifting into the wrong business classification.

Examples:
- Ecommerce language leakage
- Transactional pricing patterns
- Product/Offer schema leakage
- Crawl traps / broken internal links

### Tier C — Evidence-only Diagnostics (Non-blocking)
Diagnostics captured as evidence but not blocking by default.

Examples:
- Lighthouse breakdown
- Render delay attribution
- Long task attribution
- Font timing and swap behavior
- Preload waste

---

## 5. Homepage Contract (Milestone Focus)

### 5.1 Intent (Manufacturer B2B)
Homepage must clearly state:
- Manufacturer identity
- Bulk/MOQ context
- India context
- Procurement audience relevance
- No ecommerce signals

### 5.2 Flow (Mobile-first)
Homepage must follow a mobile-first hierarchy:
1. Hero message (what business is)
2. Trust strip (explicit trust signals)
3. Primary CTA (WhatsApp enquiry)
4. Capability proof (categories, use cases)

**Rule nuance:** CTA may be visible in the first viewport **if trust signals are also present in the first viewport**. What is forbidden is CTA without trust or repeated CTA before trust completes.

### 5.3 CTA Policy
- Exactly one primary WhatsApp CTA above the fold.
- Non-aggressive language (enquire/talk/get quote). 
- No pricing language inside CTA.
- No repeated CTA before trust section ends.

### 5.4 SEO Hygiene
- Title length within governance range
- Meta description within governance range
- Single H1
- Canonical defined
- Crawlable internal links
- OG tags warn-level

### 5.5 Schema Policy
Homepage schema must reinforce manufacturer trust without ecommerce smell:
- Allow: `Organization`, `WebSite`, optionally `WebPage`
- Forbid: `Product`, `Offer`, `AggregateOffer`, price/availability semantics

### 5.6 Performance Policy (Signals)
- **CLS:** hard fail if exceeded.
- **LCP:** policy-defined (text-first allowed). Must be stable and explainable.
- **INP:** conditional (only required if interactivity exists). Not automatically a failure on static pages.

**Output artifact (ABI-locked):** `home.contract.json`

---

## 6. Design (Apple Execution Spec)

Apple.com is the execution reference for **rendering discipline**, not aesthetics.

Design goals:
- Message before media
- Text-first mobile
- Stable layout (no jank)
- Minimal JS in the critical path
- No surprises after first paint

Homepage above-the-fold (mobile) should include:
- H1 (manufacturer identity)
- 1-line qualifier (bulk/MOQ + India)
- Trust strip (explicit signals)
- Primary WhatsApp CTA (non-aggressive)

**Output artifact:** `home.design.spec.md` (semi-locked, human-readable)

---

## 7. Develop (Implementation Principles)

### Stable Hooks (Required)
Add stable anchors so validators are deterministic:
- `data-template` (home/category/blog)
- `data-section` (hero/trust/categories/usecases/cta)
- `data-cta` (primary-whatsapp, secondary-whatsapp)

These hooks form the “UI ABI surface”. Markup can evolve behind them.

---

## 8. Run (Orchestration)

The runner executes:
- Playwright contract tests per template
- Lighthouse runs for representative template URLs
- Bundle checks

Artifacts captured:
- Screenshots (above-the-fold)
- Lighthouse JSON
- Traces (optional)

---

## 9. Validate (Reusable Validators)

Validators are pure logic modules. They do not render UI.

They must:
- read DOM / schema / lighthouse outputs
- emit evidence entries with stable IDs

Examples:
- `validateIntentManufacturerB2B()`
- `validateFlowTrustThenCTA()`
- `validateSEOHygiene()`
- `validateSchemaPolicy()`
- `collectPerformanceEvidence()`

---

## 10. Evidence (Single Source of Truth)

Evidence is canonical. Reports are derived.

Evidence entries must include:
- `id`
- `pillar`
- `severity` (error|warn|info)
- `result` (PASS|FAIL|NOT_RUN)
- `label`
- optional: `selector`, `url`, `artifacts`, `source` (playwright|lighthouse)

**Output artifact (ABI-locked):** `homepage.contract.evidence.json`

---

## 11. Verdict (Deterministic)

Verdict is computed only from evidence.

Rules:
- **BLOCKED** if any `severity=error` and `result=FAIL`
- **PASS_WITH_WARN** if no errors fail but warns fail
- **PASS** if all required checks pass
- **INCONCLUSIVE** if evidence schema invalid or required sources missing

**Output artifact:** `homepage.contract.verdict.json`

---

## 12. Report (Rendering Only)

Reports must:
- render from `evidence.json` + `verdict.json`
- never infer missing facts
- clearly label sources (DOM vs Lighthouse)
- provide an executive view + engineering drill-down

**Output artifact:** `homepage.contract.report.html`

---

## 13. Rollout Plan

### Phase H0 — Spec Lock (No code changes)
- Freeze `business_context.json`
- Freeze `home.contract.json`
- Write `home.design.spec.md`

### Phase H1 — ABI & Evidence Normalization
- Introduce evidence schema v1
- Ensure validators produce evidence conforming to schema
- Ensure verdict computation uses evidence only

### Phase H2 — Homepage Implementation
- Implement homepage design to satisfy contracts
- Stabilize UI hooks

### Phase H3 — Template Scale-out
- Add template contracts for categories, blog, about, contact
- Expand drift guards site-wide

---

## 14. Non-negotiables (Lock)

- GreenPax remains a B2B manufacturer site.
- No ecommerce/checkout intent on homepage.
- WhatsApp CTA is visible but non-aggressive and paired with trust.
- Evidence is the source of truth; reports are views.
- Strict ABI applies to governance artifacts, not to