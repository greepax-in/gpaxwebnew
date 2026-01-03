import type { Page } from "@playwright/test";

/* ======================================================
   BASE TYPES
====================================================== */

export type ValidatorPage = Page;

/* ======================================================
   SEO RULES
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
  canonical?: boolean;
  singleH1?: boolean;
  requireH2?: boolean;
  requireCrawlableLinks?: boolean;
};

/* ======================================================
   INTENT RULES
====================================================== */

export type IntentRules = {
  manufacturer?: boolean;
  requireIndia?: boolean;
  bulkIntent?: boolean;
  forbidEcommerce?: boolean;
  requireWhatsAppCTA?: boolean;
};

/* ======================================================
   FLOW RULES
====================================================== */

export type FlowRules = {
  heroFirst?: boolean;
  trustBeforeCTA?: boolean;
  requireHeroLCPGuard?: boolean;
  requireLCPBudgetMs?: number;
  maxPrimaryCTAs?: number;
  requireCLSBudget?: boolean;
};

/* ======================================================
   SCHEMA RULES
====================================================== */

export type SchemaRules = {
  requireOrganization?: boolean;
  forbidProduct?: boolean;
};

/* ======================================================
   PERFORMANCE RULES
====================================================== */

export type PerformanceRules = {
  lcp?: number;
};
