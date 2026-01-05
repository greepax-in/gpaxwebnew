# ABI — Homepage Contract (v1.0)

> **ABI-ID:** greenpax.contract.homepage
> **Version:** 1.0.0
> **Status:** LOCKED
> **Depends-on:** greenpax.business_context@1.x
> **Scope:** Homepage governance only
> **Breaking-change policy:** MAJOR version bump only

---

## Purpose

This ABI defines **what “good” means for the GreenPax homepage**.

It is the **authoritative contract** used by:
- validators
- verdict computation
- reports

UI implementation MAY evolve freely **as long as this contract is satisfied**.

---

## Contract JSON (Authoritative)

```json
{
  "abi_id": "greenpax.contract.homepage",
  "abi_version": "1.0.0",
  "imports": ["greenpax.business_context@1.x"],

  "intent": {
    "business_identity": "manufacturer",
    "operating_model": "b2b",
    "manufacturing_model": "bulk_moq",
    "geography": "IN",
    "audience": "procurement_commercial",
    "required_language": [
      "manufacturer",
      "bulk",
      "india"
    ],
    "forbidden_intent": [
      "ecommerce",
      "retail",
      "checkout"
    ]
  },

  "flow": {
    "mobile_authoritative": true,
    "logical_order": [
      "hero_message",
      "trust_strip",
      "primary_cta",
      "capability_proof"
    ],
    "cta_visibility_rule": "cta_allowed_only_with_trust",
    "cta_repetition_before_trust": false
  },

  "cta": {
    "primary": {
      "type": "whatsapp",
      "max_count_above_fold": 1,
      "copy_style": "non_aggressive",
      "allowed_verbs": ["enquire", "talk", "get quote"],
      "forbidden_terms": ["buy", "order", "price", "discount"]
    },
    "secondary": {
      "allowed": true,
      "after_section": "trust_strip"
    }
  },

  "schema": {
    "allowed_types": ["Organization", "WebSite"],
    "optional_types": ["WebPage"],
    "forbidden_types": [
      "Product",
      "Offer",
      "AggregateOffer"
    ],
    "forbidden_properties": [
      "price",
      "availability"
    ]
  },

  "seo": {
    "title_length": { "min": 30, "max": 60 },
    "meta_description_length": { "min": 70, "max": 160 },
    "single_h1_required": true,
    "canonical_required": true,
    "crawlable_internal_links_required": true
  },

  "performance": {
    "cls": {
      "threshold": 0.1,
      "severity": "error"
    },
    "lcp": {
      "policy": "text_first_allowed",
      "image_lcp_on_mobile": false
    },
    "inp": {
      "required": "conditional",
      "condition": "client_interactivity_present"
    }
  },

  "severity_policy": {
    "intent_violation": "error",
    "flow_violation": "error",
    "cta_violation": "error",
    "schema_violation": "error",
    "seo_violation": "error",
    "performance_cls_violation": "error",
    "performance_lcp_violation": "warn",
    "performance_inp_violation": "info"
  }
}
```

---

## Governance Rules

- This contract MUST be evaluated before any homepage verdict is computed.
- Validators MUST emit evidence mapped to the sections in this contract.
- Any `error` severity failure defined here results in a BLOCKED verdict.

---

## Non-negotiables (Explicit)

- Homepage must never behave like an ecommerce landing page.
- WhatsApp CTA must not be aggressive or sales-driven.
- Trust signals must exist before or with CTA visibility.
- Product / Offer schema is forbidden on homepage.

---

## Change Management

| Change Type | Allowed? | Action |
|-----------|--------|--------|
| Copy range tweak | Yes | Minor version |
| Add trust signal | Yes | Minor version |
| Change CTA policy | ❌ | Major version |
| Enable Product schema | ❌ | Major version |
| Change business model | ❌ | Major version |

---

## Rationale

This contract encodes **Google’s intent evaluation model** and **Apple’s execution discipline** into enforceable rules.

Google ranks pages that are:
- clear in purpose
- trustworthy
- stable in behavior

Apple-style execution ensures those qualities are perceived instantly.

---

**LOCK STATEMENT:**
This Homepage Contract ABI is locked at v1.0.0. Any incompatible change requires v2.0.0.
