# ABI — Business Context (v1.0)

> **ABI-ID:** greenpax.business_context
> **Version:** 1.0.0
> **Status:** LOCKED
> **Scope:** Governance / Contracts / Validators
> **Breaking-change policy:** MAJOR version bump only

---

## Purpose

This ABI defines the **authoritative business truth** for GreenPax.in.

All contracts, validators, verdict logic, and reports MUST consume this ABI.
UI implementation MAY change freely as long as it does not violate this ABI.

---

## JSON Schema (Authoritative)

```json
{
  "abi_id": "greenpax.business_context",
  "abi_version": "1.0.0",
  "business": {
    "name": "GreenPax",
    "website": "https://www.greenpax.in",
    "business_type": "manufacturer",
    "industry": "eco_friendly_paper_packaging",
    "country": "IN",
    "operating_model": "b2b",
    "manufacturing_model": "bulk_moq",
    "description": "Eco-friendly paper packaging manufacturer in India producing paper bags, covers, and boxes for commercial use."
  },
  "products": {
    "categories": [
      "paper_bags",
      "paper_covers",
      "paper_boxes"
    ],
    "customization": true,
    "private_label": true
  },
  "audience": {
    "primary": [
      "food_delivery_brands",
      "retail_chains",
      "grocery_fmcg_distributors",
      "procurement_teams",
      "business_owners"
    ],
    "search_intent": "commercial_manufacturer",
    "intent_examples": [
      "paper bag manufacturer in india",
      "bulk paper packaging supplier",
      "custom paper bags wholesale",
      "eco friendly paper covers manufacturer"
    ]
  },
  "conversion": {
    "primary_goal": "direct_enquiry",
    "primary_channel": "whatsapp",
    "cta_policy": {
      "visible": true,
      "non_aggressive": true,
      "requires_trust_signals": true,
      "allow_repetition": false
    }
  },
  "forbidden_behaviors": {
    "ecommerce": true,
    "checkout": true,
    "cart": true,
    "retail_pricing": true,
    "transactional_language": true
  },
  "notes": [
    "GreenPax is NOT a marketplace, reseller, or D2C ecommerce brand.",
    "All site pages must reinforce manufacturer credibility and procurement trust.",
    "Any future retail/D2C experience must live on a separate domain or subdomain with a different ABI."
  ]
}
```

---

## Governance Rules

- This ABI is **imported** by all page contracts (homepage, category, blog, etc.).
- Validators MUST fail-fast if this ABI is missing or malformed.
- UI changes that violate this ABI are **contract violations**, not design issues.

---

## Change Management

| Change Type | Allowed? | Action |
|-----------|--------|--------|
| Text clarification | Yes | Patch/minor version |
| Add audience segment | Yes | Minor version |
| Change business type | ❌ | Major version |
| Enable ecommerce | ❌ | Major version |
| Change conversion goal | ❌ | Major version |

---

## Rationale (Why this is ABI)

This document represents the **root truth** of the system.

Without freezing business context:
- contracts drift
- validators contradict each other
- reports become untrustworthy

This ABI ensures Google intent alignment, UX consistency, and governance stability.

---

**LOCK STATEMENT:**
This ABI is locked at v1.0.0. Any incompatible change requires v2.0.0.
