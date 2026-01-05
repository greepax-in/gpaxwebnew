
import type { Page } from "@playwright/test";

/* ======================================================
   BASE TYPES
====================================================== */

export type ValidatorPage = Page;

/* ======================================================
   CANONICAL TOGGLE TYPE (LOCKED)
====================================================== */

export type ToggleRule = {
  enabled: boolean;
};

/* ======================================================
   SEO RULES - feature toggles + data bounds
====================================================== */

export type SeoRules = {
  title: {
    min: number;
    max: number;
  };
  meta: {
    min: number;
    max: number;
  };
  canonical?: ToggleRule;
  singleH1?: ToggleRule;
  requireH2?: ToggleRule;
  requireCrawlableLinks?: ToggleRule;
};

/* ======================================================
   INTENT RULES - feature toggles only
====================================================== */

export type IntentRules = {
  manufacturer?: ToggleRule;
  requireIndia?: ToggleRule;
  bulkIntent?: ToggleRule;
  forbidEcommerce?: ToggleRule;
  requireWhatsAppCTA?: ToggleRule;
};

/* ======================================================
   FLOW RULES - feature toggles only
====================================================== */

export type FlowRules = {
  heroFirst?: ToggleRule;
  trustBeforeCTA?: ToggleRule;
  requireHeroLCPGuard?: ToggleRule;
  maxPrimaryCTAs?: { enabled: boolean; max: number };

  /**
   * Enable CLS observation (PerformanceObserver).
   * Threshold comparison is NOT done here.
   */
  requireCLSBudget?: ToggleRule;

  /**
   * Enable LCP observation (policy-based, not threshold-based).
   */
  requireLCPObservation?: ToggleRule;
};

/* ======================================================
   SCHEMA RULES - feature toggles only
====================================================== */

export type SchemaRules = {
  requireOrganization?: ToggleRule;
  forbidProduct?: ToggleRule;
};

/* ======================================================
   PERFORMANCE RULES - feature toggles only
====================================================== */

export type PerformanceRules = {
  observeINP?: ToggleRule;
};
