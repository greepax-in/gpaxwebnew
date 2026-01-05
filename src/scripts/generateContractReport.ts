// import * as fs from "fs";
// import * as path from "path";
// import { HOMEPAGE_CHECKS } from "../contracts/homepage.checks";
// import "dotenv/config";
// /* =========================================================
//    Core types and diagnostics are defined later in the file.
//    Removed duplicate/legacy declarations to avoid redeclaration errors.
// */
// export type IndicatorDomain = "performance" | "seo" | "intent" | "flow";
// export type IndicatorSeverity = "error" | "warn" | "info";

// export type IndicatorId = string;

// export type IndicatorResult = {
//   id: IndicatorId;
//   domain: IndicatorDomain;
//   severity: IndicatorSeverity;
//   passed: boolean;
//   message: string;
//   evidence?: any;
//   // Optional runtime status (e.g. 'pass' | 'fail' | 'not_run')
//   status?: string;
//   // Whether this indicator is blocking when missing/not_run
//   blocking?: boolean;
// };

// type Severity = "info" | "warn" | "error";
// type ResolvedResult = "PASS" | "FAIL" | "NOT_RUN";

// type RegistryMeta = {
//   id: string;
//   pillar: string;
//   label: string;
//   severity: Severity;
//   deprecated?: boolean;
//   aliasOf?: string;
// };

// type EvidenceRowLike = {
//   id: string;
//   result?: "PASS" | "FAIL";
//   value?: any;
//   threshold?: any;
//   units?: string;
//   evidence?: any;
//   at?: string;
// };

// type ResolvedCheck = {
//   id: string;
//   pillar: string;
//   label: string;
//   severity: Severity;
//   result: ResolvedResult;
//   value?: any;
//   threshold?: any;
//   units?: string;
//   evidence?: any;
//   source?: "evidence" | "alias" | "registry";
// };

// export type LcpRootCause = {
//   server: boolean;
//   network: boolean;
//   scriptExecution: boolean;
//   imageDecode: boolean;
//   styleLayout: boolean;
//   fontResolution: "possible" | "unlikely";
//   evidence: string[];
// };



// // ==================================================
// // DIAGNOSTICS (ADVISORY ONLY — NEVER BLOCKING)
// // ==================================================

// const diagnostics: any = {
//   lcp: { advisory: false as const, data: null as any },
//   longTasks: { advisory: true as const, data: null as any },
//   fontLoading: { advisory: true as const, data: null as any },
//   imageDecode: { advisory: true as const, data: null as any },
// };

// const inputPath = path.resolve("reports/contract-results.json");
// const jsonOut = path.resolve("reports/homepage.contract.report.json");
// const htmlOut = path.resolve("reports/homepage.contract.report.html");
// const evidencePath = path.resolve("reports/homepage.contract.evidence.json");
// const trendOut = path.resolve("reports/homepage.perf.trend.json");

// const lighthouseMobilePath = path.resolve("reports/lighthouse.home.mobile.json");
// const lighthouseDesktopPath = path.resolve("reports/lighthouse.home.desktop.json");

// function readLighthouse(file: string) {
//   if (!fs.existsSync(file)) return null;
//   const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
//   const lhr = raw.lhr;
//   const meta = raw.meta || null;

//   return {
//     meta,
//     analysis: (raw as any).analysis ?? null,
//     scores: {
//       performance: lhr.categories.performance.score != null
//         ? Math.round(lhr.categories.performance.score * 100)
//         : null,
//       seo: lhr.categories.seo.score != null
//         ? Math.round(lhr.categories.seo.score * 100)
//         : null,
//     },
//     vitals: {
//       lcpMs: lhr.audits["largest-contentful-paint"]?.numericValue != null
//         ? Math.round(lhr.audits["largest-contentful-paint"].numericValue)
//         : null,
//       cls: lhr.audits["cumulative-layout-shift"]?.numericValue != null
//         ? Number(lhr.audits["cumulative-layout-shift"].numericValue.toFixed(3))
//         : null,
//       inpMs:
//         lhr.audits["interaction-to-next-paint"]?.numericValue ??
//         lhr.audits["total-blocking-time"]?.numericValue ??
//         null,
//       ttfbMs:
//         lhr.audits["server-response-time"]?.numericValue != null
//           ? Math.round(lhr.audits["server-response-time"].numericValue)
//           : lhr.audits["time-to-first-byte"]?.numericValue != null
//           ? Math.round(lhr.audits["time-to-first-byte"].numericValue)
//           : null,
//     },
//   };
// }

// const lighthouse = {
//   mobile: readLighthouse(lighthouseMobilePath),
//   desktop: readLighthouse(lighthouseDesktopPath),
// };

// // --------------------------------------------------
// // Lighthouse Mobile — raw diagnostics (LCP breakdown)
// // --------------------------------------------------

// const rawLighthouseMobile = fs.existsSync(lighthouseMobilePath)
//   ? JSON.parse(fs.readFileSync(lighthouseMobilePath, "utf-8"))
//   : null;

// const rawLighthouseDesktop = fs.existsSync(lighthouseDesktopPath)
//   ? JSON.parse(fs.readFileSync(lighthouseDesktopPath, "utf-8"))
//   : null;

// const lcpBreakdownMobile = rawLighthouseMobile
//   ? extractLcpBreakdown(rawLighthouseMobile)
//   : null;

// const PRELOAD_FONT_ESTIMATE_MS = 60; // conservative, documented

// const renderDelaySplitMobile =
//   lcpBreakdownMobile?.attribution?.renderDelayMs != null
//     ? splitRenderDelayAttribution({
//         totalRenderDelayMs:
//           lcpBreakdownMobile.attribution.renderDelayMs,
//         imageLoadMs:
//           lcpBreakdownMobile.attribution.resourceLoadTimeMs ?? null,
//         fontEstimateMs: PRELOAD_FONT_ESTIMATE_MS,
//       })
//     : null;

// function computeLcpPhaseBreakdown(lighthouseRaw: any) {
//   const metrics = lighthouseRaw?.lhr?.audits?.metrics?.details?.items?.[0];
//   if (!metrics) return null;

//   const lcpMs = metrics.largestContentfulPaint;
//   const ttfbMs = metrics.timeToFirstByte;
//   const lcpLoadStart = metrics.lcpLoadStart;
//   const lcpLoadEnd = metrics.lcpLoadEnd;

//   if (
//     [lcpMs, ttfbMs, lcpLoadStart, lcpLoadEnd].some(
//       (v) => typeof v !== "number"
//     )
//   ) {
//     return null;
//   }

//   const resourceLoadMs = Math.max(0, lcpLoadEnd - lcpLoadStart);
//   const renderPhaseMs = Math.max(0, lcpMs - lcpLoadEnd);
//   const phases = [
//     { key: "ttfb", value: ttfbMs },
//     { key: "resourceLoad", value: resourceLoadMs },
//     { key: "render", value: renderPhaseMs },
//   ];
//   const dominant = phases.reduce((max, cur) =>
//     cur.value > max.value ? cur : max
//   );

//   return {
//     lcpMs,
//     ttfbMs,
//     lcpLoadStart,
//     lcpLoadEnd,
//     resourceLoadMs,
//     renderPhaseMs,
//     dominantPhase: dominant.key,
//   };
// }

// const lcpPhaseBreakdown = {
//   mobile: computeLcpPhaseBreakdown(rawLighthouseMobile),
//   desktop: computeLcpPhaseBreakdown(rawLighthouseDesktop),
// };
// // Compatibility wrapper: accept either a full raw runner object (with `.lhr`)
// // or a direct `lhr` object. We call the canonical `extractLongTasks` after
// // normalizing the shape so downstream code doesn't need to care about input.
// function extractLongTasksFromRaw(lighthouseRaw: any) {
//   const lhr = lighthouseRaw?.lhr ?? lighthouseRaw;
//   return extractLongTasks({ lhr });
// }

// // Canonical extractor for long-tasks given a normalized LHR object.
// function extractLongTasks({ lhr }: { lhr: any }) {
//   const audit = lhr?.audits?.["long-tasks"];
//   if (!audit?.details?.items) return null;

//   const tasks = audit.details.items
//     .filter((t: any) => t.duration >= 50)
//     .map((t: any) => {
//       const attr = Array.isArray(t.attribution)
//         ? t.attribution[0]
//         : null;

//       return {
//         durationMs: Math.round(t.duration),
//         startTimeMs: Math.round(t.startTime),
//         taskName: t.name ?? attr?.name ?? "unknown",
//         scriptUrl: attr?.url ?? "unattributed",
//         attributionMs:
//           typeof attr?.total === "number"
//             ? Math.round(attr.total)
//             : null,
//       };
//     });

//   return {
//     totalBlockingMs: Math.round(audit.numericValue ?? 0),
//     tasks,
//   };
// }

// const longTasksMobile =
//   rawLighthouseMobile ? extractLongTasksFromRaw(rawLighthouseMobile) : null;

// // --- PRE-JSON (compute only; do not mutate jsonReport here) ---
// const fontDisplayEnforcement =
//   rawLighthouseMobile ? enforceFontDisplaySwap(rawLighthouseMobile) : null;

// const heroPreloadCheck =
//   rawLighthouseMobile && lcpBreakdownMobile
//     ? verifyHeroImagePreload(rawLighthouseMobile, lcpBreakdownMobile)
//     : null;


// // Explicit LCP ownership (contract-level attribution)
// const lcpOwner = deriveLcpOwner(
//   lcpBreakdownMobile,
//   longTasksMobile
// );

// function extractLcpBreakdown(lighthouseRaw: any) {
//   if (!lighthouseRaw?.lhr?.audits) return null;

//   const audits = lighthouseRaw.lhr.audits;
//   const lcpAudit = audits["largest-contentful-paint"];
//   const elementAudit = audits["largest-contentful-paint-element"];

//   // We always try to render *something* if numericValue exists,
//   // because some Lighthouse runners save a trimmed LHR without `details`.
//   const total = lcpAudit?.numericValue != null ? Math.round(lcpAudit.numericValue) : null;
//   if (total == null) return null;

//   const ttfb =
//     audits["server-response-time"]?.numericValue != null
//       ? Math.round(audits["server-response-time"].numericValue)
//       : audits["time-to-first-byte"]?.numericValue != null
//       ? Math.round(audits["time-to-first-byte"].numericValue)
//       : null;

//   const item = lcpAudit?.details?.items?.[0] ?? null;

//   return {
//     totalLcpMs: total,
//     ttfbMs: ttfb,
//     attribution: {
//       // Preferred (full LHR): these fields come from LCP audit details
//       resourceLoadDelayMs:
//         item?.resourceLoadDelay != null
//           ? Math.round(item.resourceLoadDelay)
//           : null,
//       resourceLoadTimeMs:
//         item?.resourceLoadDuration != null
//           ? Math.round(item.resourceLoadDuration)
//           : null,
//       renderDelayMs:
//         item?.renderDelay != null
//           ? Math.round(item.renderDelay)
//           : ttfb != null
//           ? Math.max(0, total - ttfb)
//           : null,
//       renderDelayApproximate: item?.renderDelay == null,
//     },
//       lcpElement: {
//         tagName: elementAudit?.details?.items?.[0]?.node?.nodeLabel ?? null,
//         selector: elementAudit?.details?.items?.[0]?.node?.selector ?? null,
//       },
//     element: {
//       selector:
//         elementAudit?.details?.items?.[0]?.node?.selector ?? null,
//     },
//     resource: {
//       url: item?.url ?? null,
//     },
//     // helpful for debugging runner outputs
//     _hasFullDetails: Boolean(item),
//   };
// }

// // --------------------------------------------------
// // Contract helper — identify image-based LCP
// // --------------------------------------------------
// function isImageLcp(lcpBreakdown: any): boolean {
//   if (!lcpBreakdown) return false;

//   const tag =
//     (lcpBreakdown.lcpElement?.tagName || "").toLowerCase();

//   // Direct element check
//   if (tag === "img" || tag === "picture") return true;

//   // Resource URL fallback
//   const url = lcpBreakdown.resource?.url || "";
//   return /\.(png|jpe?g|webp|avif|svg)$/i.test(url);
// }

// function splitRenderDelay(lcpBreakdown: any) {
//   if (!lcpBreakdown?.attribution) return null;

//   const {
//     renderDelayMs,
//     resourceLoadTimeMs,
//   } = lcpBreakdown.attribution;

//   if (
//     typeof renderDelayMs !== "number" ||
//     typeof resourceLoadTimeMs !== "number"
//   ) {
//     return {
//       imageDecodeMs: null,
//       cssRenderMs: renderDelayMs ?? null,
//       approximate: true,
//     };
//   }

//   // Heuristic:
//   // image decode typically scales with download time
//   const imageDecodeMs = Math.min(
//     renderDelayMs,
//     Math.round(resourceLoadTimeMs * 0.6)
//   );

//   const cssRenderMs = Math.max(
//     0,
//     renderDelayMs - imageDecodeMs
//   );

//   return {
//     imageDecodeMs,
//     cssRenderMs,
//     approximate: false,
//   };
// }

// function splitRenderDelayAttribution(params: {
//   totalRenderDelayMs: number | null;
//   imageLoadMs: number | null;
//   fontEstimateMs?: number;
// }) {
//   if (params.totalRenderDelayMs == null) {
//     return null;
//   }

//   const imageDecodeMs = params.imageLoadMs ?? 0;
//   const fontMs = params.fontEstimateMs ?? 0;

//   // Remaining render time after image decode + fonts
//   const cssLayoutMs = Math.max(
//     0,
//     params.totalRenderDelayMs - imageDecodeMs - fontMs
//   );

//   return {
//     imageDecodeMs,
//     cssLayoutMs,
//     fontMs,
//   };
// }

// function deriveRenderDelayMath(params: {
//   imageDecodeMs?: number | null;
//   cssLayoutMs?: number | null;
//   fontMs?: number | null;
//   jsMs?: number | null;
//   cpuMultiplier: number;
// }) {
//   const rows = [
//     { label: "Image decode", base: params.imageDecodeMs ?? 0 },
//     { label: "CSS / layout", base: params.cssLayoutMs ?? 0 },
//     { label: "Font / style recalculation", base: params.fontMs ?? 0 },
//     { label: "JS hydration", base: params.jsMs ?? 0 },
//   ];

//   return rows.map(r => ({
//     ...r,
//     multiplier: params.cpuMultiplier,
//     effective: Math.round(r.base * params.cpuMultiplier),
//   }));
// }

// function verifyHeroImagePreload(lighthouseRaw: any, lcpBreakdown: any) {
//   if (!lighthouseRaw?.lhr?.audits || !lcpBreakdown?.resource?.url) return null;

//   const preloadAudit = lighthouseRaw.lhr.audits["preload-lcp-image"];
//   const passed =
//     preloadAudit?.score === 1 ||
//     (Array.isArray(preloadAudit?.details?.items) && preloadAudit.details.items.length === 0);

//   return {
//     lcpImage: lcpBreakdown.resource.url,
//     preloaded: Boolean(passed),
//     auditScore: preloadAudit?.score ?? null,
//     source: "lighthouse.preload-lcp-image",
//   };
// }

// /**
//  * Heuristic to derive an LCP owner object for contract reporting.
//  * Combines LCP element/resource hints with long-task correlation.
//  */
// function deriveLcpOwner(lcpBreakdown: any, longTasks: any) {
//   if (!lcpBreakdown) return null;

//   const isImage = Boolean(
//     (lcpBreakdown.lcpElement?.tagName || "").toLowerCase().includes("img") ||
//       (lcpBreakdown.resource?.url || "").toLowerCase().match(/\.(png|jpg|jpeg|webp|avif|svg)$/)
//   );

//   const hasBlockingJsBeforeLcp =
//     longTasks?.tasks?.some(
//       (t: any) => typeof t.startTimeMs === "number" && t.startTimeMs <= lcpBreakdown.totalLcpMs
//     ) ?? false;

//   const type = isImage
//     ? hasBlockingJsBeforeLcp
//       ? "image + client hydration"
//       : "image only (no blocking JS before LCP detected)"
//     : hasBlockingJsBeforeLcp
//     ? "component + client hydration"
//     : "component";

//   const source = lcpBreakdown.lcpElement ? "lighthouse.lcp-element" : "derived:lighthouse+lcp+longtasks";

//   return {
//     component: "HomeHero",
//     file: "src/components/Home/HomeHero.tsx",
//     type,
//     aboveTheFold: true,
//     source,
//   };
// }

// function deriveLcpRootCauseFromLighthouse(lh: any): LcpRootCause | null {
//   const audit = lh?.audits?.["largest-contentful-paint"];
//   const item = audit?.details?.items?.[0];
//   if (!item) return null;

//   const {
//     largestContentfulPaint,
//     timeToFirstByte,
//     resourceLoadDelay,
//     resourceLoadTime,
//     elementRenderDelay,
//     node
//   } = item;

//   const evidence: string[] = [];

//   const server = typeof timeToFirstByte === "number" && timeToFirstByte > 200;
//   if (!server) evidence.push("TTFB below threshold (server not blocking)");

//   const network =
//     resourceLoadDelay !== null || resourceLoadTime !== null;
//   if (!network) evidence.push("No resource request or download delay");

//   const scriptExecution =
//     lh?.audits?.["long-tasks"]?.details?.items?.length > 0;
//   if (!scriptExecution) evidence.push("No blocking JavaScript tasks detected");

//   const imageDecode =
//     node?.nodeLabel === "IMG" &&
//     typeof elementRenderDelay === "number" &&
//     elementRenderDelay > 0;

//   if (imageDecode) {
//     evidence.push("LCP element is IMG with dominant render/decode delay");
//   }

//   const styleLayout =
//     typeof elementRenderDelay === "number" &&
//     elementRenderDelay >
//       (largestContentfulPaint -
//         (timeToFirstByte ?? 0));

//   if (styleLayout) {
//     evidence.push("Pre-paint render delay dominates LCP timeline");
//   }

//   const fontResolution =
//     lh?.audits?.["render-blocking-resources"]?.details?.items?.some(
//       (r: any) =>
//         typeof r.url === "string" &&
//         r.url.includes("fonts")
//     )
//       ? "possible"
//       : "unlikely";

//   if (fontResolution === "possible") {
//     evidence.push("Web fonts referenced in render tree");
//   }

//   return {
//     server,
//     network,
//     scriptExecution,
//     imageDecode,
//     styleLayout,
//     fontResolution,
//     evidence
//   };
// }

// function correlateTasksToLCP(longTasks: any, lcpBreakdown: any) {
//   if (!longTasks || !lcpBreakdown?.totalLcpMs) return [];

//   const lcpRenderEnd = lcpBreakdown.totalLcpMs;

//   return (longTasks.tasks || []).filter(
//     (t: any) =>
//       typeof t.startTimeMs === "number" &&
//       t.startTimeMs <= lcpRenderEnd
//   );
// }

// function renderLongTaskAttribution(tasks: any[]) {
//   const scripts = new Map<string, number>();

//   tasks.forEach(task => {
//     if (task.url) {
//       scripts.set(
//         task.url,
//         (scripts.get(task.url) ?? 0) + (task.durationMs ?? 0)
//       );
//     }
//   });

//   return Array.from(scripts.entries())
//     .sort((a, b) => b[1] - a[1])
//     .map(
//       ([url, time]) => `
//       <tr>
//         <td>${url.replace(/^https?:\/\//, "")}</td>
//         <td>${Math.round(time)} ms</td>
//       </tr>`
//     )
//     .join("");
// }

// // Long Task Classification
// // Prefer duration-based classification but remain compatible with
// // attribution-based shapes from older LHR outputs.
// function classifyLongTask(task: any) {
//   const duration = task?.duration ?? task?.durationMs ?? 0;

//   if (duration > 200) {
//     return {
//       category: "style/layout",
//       likelyCause: "Large CSS or layout recalculation",
//     };
//   }
//   if (duration > 100) {
//     return {
//       category: "font-loading",
//       likelyCause: "Font swap or blocking font load",
//     };
//   }

//   // Fallback: attribute by URL if present (best-effort)
//   if (task.attribution?.some((a: any) => a.url?.match(/\.(png|jpg|webp|avif)$/))) {
//     return {
//       category: "image-decode",
//       likelyCause: "Hero image decode",
//     };
//   }

//   return {
//     category: "js-execution",
//     likelyCause: "JavaScript execution",
//   };
// }

// function extractLcpElement(lhr: any) {
//   try {
//     const item =
//       lhr?.audits?.["largest-contentful-paint"]?.details?.items?.[0];
//     return item?.node
//       ? {
//           selector: item.node.selector ?? "unknown",
//           snippet: item.node.snippet ?? null,
//           nodeLabel: item.node.nodeLabel ?? null,
//         }
//       : null;
//   } catch {
//     return null;
//   }
// }

// function enforceFontDisplaySwap(lighthouseRaw: any) {
//   if (!lighthouseRaw?.lhr?.audits) return null;

//   const audit = lighthouseRaw.lhr.audits["font-display"];
//   if (!audit?.details?.items) return null;

//   const blockingFonts = audit.details.items.filter(
//     (f: any) => f?.display !== "swap" && f?.display !== "optional"
//   );

//   return {
//     blockingCount: blockingFonts.length,
//     blockingFonts: blockingFonts.map((f: any) => ({
//       url: f.url ?? null,
//       display: f.display ?? null,
//     })),
//     pass: blockingFonts.length === 0,
//     source: "lighthouse.font-display",
//   };
// }

// function detectFontBlocking(lighthouseRaw: any, lcpBreakdown: any) {
//   if (!lighthouseRaw?.lhr?.audits || !lcpBreakdown) return null;

//   const audits = lighthouseRaw.lhr.audits;
//   const fontAudit = audits["font-display"];

//   const hasBlockingFonts =
//     fontAudit?.details?.items?.some(
//       (f: any) =>
//         f?.wastedMs != null && f.wastedMs > 0
//     ) ?? false;

//   return {
//     hasBlockingFonts,
//     recommendation:
//       hasBlockingFonts
//         ? "Use font-display: swap and preload critical fonts"
//         : "No blocking font behavior detected",
//     source: "lighthouse.font-display",
//   };
// }

// // --------------------------------------------------
// // Execution timestamp (must exist before evidence binding)
// // --------------------------------------------------

// function deriveRenderDelayAttribution(lcpBreakdown: any) {
//   if (
//     !lcpBreakdown ||
//     typeof lcpBreakdown.attribution?.renderDelayMs !== "number"
//   ) {
//     return null;
//   }

//   const renderDelay = lcpBreakdown.attribution.renderDelayMs;

//   return [
//     {
//       source: "Image decode & rasterization",
//       estimatedMs: Math.round(renderDelay * 0.45),
//       rationale: "Compressed image decode + paint under mobile CPU throttling",
//     },
//     {
//       source: "CSS style & layout",
//       estimatedMs: Math.round(renderDelay * 0.30),
//       rationale: "Above-the-fold layout & style recalculation",
//     },
//     {
//       source: "Font swap & text layout",
//       estimatedMs: Math.round(renderDelay * 0.15),
//       rationale: "font-display swap & reflow cost",
//     },
//     {
//       source: "Residual main-thread work",
//       estimatedMs: Math.max(
//         0,
//         renderDelay - Math.round(renderDelay * 0.9)
//       ),
//       rationale: "Minor scheduling / paint overhead",
//     },
//   ];
// }

// const generatedAt = new Date().toISOString();

// // --------------------------------------------------
// // Evidence map (authoritative runtime store)
// // --------------------------------------------------

// // Ensure `jsonReport` exists prior to any post-compute mutations
// let jsonReport: any = {};

// function formatMs(ms: number | null) {
//   return typeof ms === "number" ? `${Math.round(ms)}ms` : "n/a";
// }

// // Minimal HTML escaper for embedding JSON safely in <pre><code>
// function escapeHtml(input: any) {
//   const s = typeof input === "string" ? input : JSON.stringify(input, null, 2);
//   return s
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;");
// }

// function fontDisplayEnforcementHelper(fonts: any[]) {
//   return Array.isArray(fonts) ? fonts.every((f: any) => f?.display === "swap") : false;
// }

// const evidenceById = new Map<string, any>();

// // Lighthouse → Contract perf evidence binding (authoritative)
// if (lighthouse.mobile?.vitals?.ttfbMs != null) {
//   evidenceById.set("PERF-04", {
//     id: "PERF-04",
//     result: lighthouse.mobile.vitals.ttfbMs <= 800 ? "PASS" : "FAIL",
//     value: lighthouse.mobile.vitals.ttfbMs,
//     threshold: 800,
//     units: "ms",
//     evidence: "Lighthouse mobile server-response-time",
//     at: generatedAt,
//   });
// }
// /* --------------------------------------------------
//    Workspace / Environment Identity (Context Only)
// -------------------------------------------------- */

// const WORKSPACE =
//   process.env.WORKSPACE?.trim() || "UNKNOWN";

// // NOTE:
// // Removed legacy renderLighthouseSection().
// // Canonical Lighthouse rendering is handled by renderLighthousePerformance()
// // to avoid duplicate budget logic and governance drift.

// if (!fs.existsSync(inputPath)) {
//   console.error("❌ Playwright JSON report not found:", inputPath);
//   // Exit removed: emit an indicator instead of hard exiting
//   pushIndicator({
//     id: "PLAYWRIGHT_JSON_MISSING",
//     status: "fail",
//     message: "Playwright JSON report not found",
//     evidence: { path: inputPath },
//   });
// }

// const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
// const stats = raw.stats ?? {};

//  // Extract LCP evidence if present (future-safe)
//  const lcpEvidence =
//    raw.annotations?.find((a: any) => a.type === "lcp")?.value ?? null;

// const passed = stats.expected ?? 0;
// const failed = stats.unexpected ?? 0;
// const skipped = stats.skipped ?? 0;
// const flaky = stats.flaky ?? 0;

// const total = passed + failed + skipped + flaky;
// const status = failed === 0 ? "PASSED" : "FAILED";

// const pillars = {
//   seo: status === "PASSED" ? "PASS" : "FAIL",
//   schema: status === "PASSED" ? "PASS" : "FAIL",
//   intent: status === "PASSED" ? "PASS" : "FAIL",
//   cta_flow: status === "PASSED" ? "PASS" : "FAIL",
// };

// const evidenceRows: any[] = fs.existsSync(evidencePath)
//   ? JSON.parse(fs.readFileSync(evidencePath, "utf-8"))
//   : [];

// const bundleEvidencePath = path.resolve("reports/bundle.contract.evidence.json");
// if (fs.existsSync(bundleEvidencePath)) {
//   const bundleEvidence = JSON.parse(
//     fs.readFileSync(bundleEvidencePath, "utf-8")
//   );
//   evidenceRows.push(...bundleEvidence);
// }

// for (const row of evidenceRows) evidenceById.set(row.id, row);

// /* ---------------- CHECK-BY-CHECK EVIDENCE ---------------- */

// function buildRegistry(): RegistryMeta[] {
//   const out: RegistryMeta[] = [];
//   for (const [pillar, rules] of Object.entries(HOMEPAGE_CHECKS as any)) {
//     for (const rule of rules as any[]) {
//       out.push({
//         id: rule.id,
//         pillar,
//         label: rule.label,
//         severity: (rule.severity ?? "info") as Severity,
//         deprecated: Boolean(rule.deprecated),
//         aliasOf: rule.aliasOf,
//       });
//     }
//   }
//   return out;
// }

// /**
//  * Phase-2.1 Evidence Resolver (Authoritative)
//  * - Registry is the source of truth for label/severity/pillar.
//  * - Runtime evidence supplies result/value/threshold.
//  * - If a registry check is deprecated, we exclude it from resolved output.
//  * - If a check has aliasOf, we use the aliased evidence when direct evidence is missing.
//  * - If no evidence exists, result is NOT_RUN (does NOT imply pass/fail).
//  */
// function resolveEvidence(
//   registry: RegistryMeta[],
//   evidenceMap: Map<string, EvidenceRowLike>
// ): ResolvedCheck[] {
//   const resolved: ResolvedCheck[] = [];

//   for (const meta of registry) {
//     if (meta.deprecated) continue; // eliminate registry duplicates

//     // ---------------- PERF-01 OVERRIDE ----------------
//     // PERF-01 (Homepage LCP) is strictly derived from Lighthouse Mobile
//     if (meta.id === "PERF-01") {
//       const canonicalFromRaw =
//         rawLighthouseMobile?.lhr?.audits?.["largest-contentful-paint"]?.numericValue ?? null;
//       const lcp = canonicalFromRaw != null
//         ? Math.round(canonicalFromRaw)
//         : lighthouse?.mobile?.vitals?.lcpMs ?? null;

//       resolved.push({
//         id: meta.id,
//         pillar: meta.pillar,
//         label: meta.label,
//         severity: meta.severity,
//         result:
//           lcp == null
//             ? "NOT_RUN"
//             : lcp <= 2500
//             ? "PASS"
//             : "FAIL",
//         value: lcp,
//         threshold: 2500,
//         units: "ms",
//         evidence: "lighthouse.mobile.lcp",
//         source: "registry",
//       });

//       continue;
//     }

//     // ---------------- PERF-04 OVERRIDE ----------------
//     // PERF-04 (Homepage TTFB) is strictly derived from Lighthouse Mobile
//     if (meta.id === "PERF-04") {
//       const ttfb = lighthouse?.mobile?.vitals?.ttfbMs ?? null;

//       resolved.push({
//         id: meta.id,
//         pillar: meta.pillar,
//         label: meta.label,
//         severity: meta.severity,
//         result:
//           ttfb == null
//             ? "NOT_RUN"
//             : ttfb <= 800
//             ? "PASS"
//             : "FAIL",
//         value: ttfb,
//         threshold: 800,
//         units: "ms",
//         evidence: "lighthouse.mobile.ttfb",
//         source: "registry",
//       });

//       continue;
//     }

//     const direct = evidenceMap.get(meta.id);
//     const aliased = meta.aliasOf ? evidenceMap.get(meta.aliasOf) : undefined;

//     const ev = direct ?? aliased;
//     const source: ResolvedCheck["source"] =
//       direct ? "evidence" : aliased ? "alias" : "registry";

//     const result: ResolvedResult =
//       ev?.result === "PASS" || ev?.result === "FAIL" ? ev.result : "NOT_RUN";

//     resolved.push({
//       id: meta.id,
//       pillar: meta.pillar,
//       label: meta.label,
//       severity: meta.severity,
//       result,
//       value: ev?.value,
//       threshold: ev?.threshold,
//       units: ev?.units,
//       evidence: ev?.evidence,
//       source,
//     });
//   }

//   // stable ordering: pillar then id
//   resolved.sort((a, b) =>
//     a.pillar === b.pillar ? a.id.localeCompare(b.id) : a.pillar.localeCompare(b.pillar)
//   );
//   return resolved;
// }

// const registry = buildRegistry();
// const resolvedEvidence = resolveEvidence(registry, evidenceById);

// /* =========================================================
//    INDICATOR BUILD (SINGLE SOURCE OF VERDICT TRUTH)
//    ========================================================= */

// const indicators: IndicatorResult[] = [];

// // Only ERROR-level checks are treated as indicators (blocking scope)
// const enforcementEvidence = resolvedEvidence.filter(
//   (r) => (r.severity as IndicatorSeverity) === "error"
// );

// for (const r of enforcementEvidence) {
//   const domain = (r.pillar as IndicatorDomain) ?? "seo";
//   const severity = (r.severity as IndicatorSeverity) ?? "info";

//   const passed =
//     r.result === "PASS"
//       ? true
//       : r.result === "FAIL"
//       ? false
//       : severity === "info"
//       ? true
//       : false; // NOT_RUN fails warn/error

//   pushIndicator(
//     indicators,
//     {
//       id: r.id,
//       domain,
//       severity,
//       passed,
//       message:
//         r.result === "PASS"
//           ? "PASS"
//           : r.result === "FAIL"
//           ? `FAIL: ${r.label}`
//           : `NOT_RUN: ${r.label}`,
//       evidence: {
//         value: r.value,
//         threshold: r.threshold,
//         units: r.units,
//         source: r.source,
//       },
//       status: typeof r.result === "string" ? r.result.toLowerCase() : undefined,
//       blocking: r.severity === "error",
//     }
//   );
// }

// const canonicalFromRawForMobile =
//   rawLighthouseMobile?.lhr?.audits?.["largest-contentful-paint"]?.numericValue ?? null;
// const mobileLcp = canonicalFromRawForMobile != null
//   ? Math.round(canonicalFromRawForMobile)
//   : lighthouse?.mobile?.vitals?.lcpMs ?? null;
// pushIndicator({
//   id: "PERF-01:EMISSION",
//   status: Number.isFinite(mobileLcp) ? "pass" : "not_run",
//   message: Number.isFinite(mobileLcp)
//     ? "Mobile LCP emitted"
//     : "Mobile LCP not emitted by Lighthouse",
//   evidence: {
//     lcpMs: mobileLcp,
//     device: "mobile",
//     reason: Number.isFinite(mobileLcp)
//       ? undefined
//       : "No LCP candidate observed. This is expected when hero image is intentionally excluded from LCP (text-first mobile strategy) or when LCP observer does not fire under throttling.",
//   },
//   blocking: false,
// });


// /* =========================================================
//    DIAGNOSTICS (EXPLICITLY ADVISORY)
//    ========================================================= */

// // reuse `diagnostics` defined earlier
// diagnostics["lcp"] = { advisory: false, data: lcpBreakdownMobile };
// diagnostics["longTasks"] = { advisory: true, data: longTasksMobile };
// diagnostics["performance"] = {
//   advisory: true,
//   data: {
//     mobile: lighthouse.mobile?.vitals ?? null,
//     desktop: lighthouse.desktop?.vitals ?? null,
//   },
// };
// diagnostics["lcpPhaseBreakdown"] = {
//   advisory: true,
//   data: lcpPhaseBreakdown,
// };


// /* ---------------- PERF GOVERNANCE ENFORCEMENT ----------------
//    Every PERF-* check must have exactly ONE evidence source.
//    Prevents silent double-binding (e.g. Playwright + Lighthouse).
// --------------------------------------------------------------- */

// const perfChecks = resolvedEvidence.filter((r) => r.id.startsWith("PERF-"));

// for (const check of perfChecks) {
//   if (!check.source) {
//     console.error(
//       `❌ PERF check ${check.id} has no evidence source (NOT_RUN is allowed, but source must be explicit)`
//     );
//     // Record an indicator rather than exiting the process
//     pushIndicator(
//       "performance",
//       check.id,
//       "error",
//       false,
//       `PERF check ${check.id} has no evidence source (NOT_RUN is allowed, but source must be explicit)`,
//       { check }
//     );
//   }

//   if (!["registry", "evidence", "alias"].includes(check.source as string)) {
//     console.error(
//       `❌ PERF check ${check.id} has invalid source: ${check.source}`
//     );
//     // Record an indicator rather than exiting the process
//     pushIndicator(
//       "performance",
//       check.id,
//       "error",
//       false,
//       `PERF check ${check.id} has invalid source: ${check.source}`,
//       { check }
//     );
//   }
// }

// // Enforce uniqueness (no duplicate PERF IDs after resolution)
// const perfIds = perfChecks.map((c) => c.id);
// const dupes = perfIds.filter((id, idx) => perfIds.indexOf(id) !== idx);

// if (dupes.length > 0) {
//   console.error("❌ Duplicate PERF checks detected after resolution:", dupes);
//   // Record a single indicator for duplicate PERF checks instead of exiting
//   pushIndicator({
//     id: "PERF_DUPLICATE_CHECKS",
//     status: "fail",
//     message: "Duplicate PERF checks detected after resolution",
//     evidence: { dupes },
//   });
// }

// // Group for UI sections (single source of truth)
// const checks = Object.fromEntries(
//   Object.entries(HOMEPAGE_CHECKS).map(([pillar]) => [
//     pillar,
//     resolvedEvidence.filter((r) => r.pillar === pillar),
//   ])
// );

// // Extract perf metrics (numeric evidence)

// const perf = {
//   // PERF-01 is AUTHORITATIVE from Lighthouse Mobile only
//   // Playwright or other sources must NOT influence LCP gate
//   lcpMs: canonicalFromRawForMobile != null
//     ? Math.round(canonicalFromRawForMobile)
//     : lighthouse?.mobile?.vitals?.lcpMs ?? null,
//   // PERF-04 — Homepage TTFB (Lighthouse Mobile)
//   ttfbMs: lighthouse?.mobile?.vitals?.ttfbMs ?? null,
//   cls: evidenceById.get("PERF-02")?.value ?? null,
//   inpMs: evidenceById.get("PERF-03")?.value ?? null,
//   lcpElement: extractLcpElement(rawLighthouseMobile?.lhr ?? null),
//   longTasks: rawLighthouseMobile ? extractLongTasksFromRaw(rawLighthouseMobile) : null,
// };

// function deriveVerdict(evidence: any[]) {
//   const hasError = evidence.some(
//     (e) => e.result === "FAIL" && e.severity === "error"
//   );

//   const hasWarn = evidence.some(
//     (e) => e.result === "FAIL" && e.severity === "warn"
//   );

//   if (hasError) return "BLOCKED";
//   if (hasWarn) return "APPROVED_WITH_WARNINGS";
//   return "APPROVED";
// }

// function deriveVerdictFromIndicators(indicators: IndicatorResult[]) {
//   // Treat explicit failures as blocking.
//   // Ignore `not_run` indicators for the immediate block decision
//   // unless they are explicitly marked `blocking` elsewhere.
//   const hasBlockingFail = indicators.some((i) => {
//     const status = (i as any).status ? String((i as any).status).toLowerCase() : null;
//     // Only ERROR-level + explicit fail can block.
//     if (status === "not_run") return false;
//     return status === "fail" && i.severity === "error";
//   });

//   // Count blocking NOT_RUNs (kept for telemetry / later gating if needed)
//   const blockingNotRun = indicators.filter((i) => {
//     const status = (i as any).status ? String((i as any).status).toLowerCase() : null;
//     return status === "not_run" && Boolean((i as any).blocking);
//   }).length;

//   if (hasBlockingFail) return "BLOCKED";

//   if (indicators.some((i) => !i.passed && i.severity === "warn")) {
//     return "APPROVED_WITH_WARNINGS";
//   }

//   // No explicit blocking failures; approved. Note: blockingNotRun may be >0,
//   // but NOT_RUN no longer automatically blocks unless upgraded elsewhere.
//   return "APPROVED";
// }

// function renderSeverity(severity?: string) {
//   const safe = severity ?? "info";
//   return `<span class="severity ${safe}">${safe.toUpperCase()}</span>`;
// }

// function renderPlaywrightPerformanceNote() {
//   return `
//     <section>
//       <h2>Performance (Playwright Audit)</h2>
//       <p class="muted">
//         These metrics are best-effort signals captured during Playwright runs.
//         Values may be <code>n/a</code> and are <strong>not</strong> used for
//         performance budget enforcement.
//       </p>
//     </section>
//   `;
// }

// function renderExecutionStatus() {
//   return `
//     <section>
//       <h2>Execution Status</h2>
//       <p class="status completed">COMPLETED</p>
//       <p class="muted">
//         All contract checks executed. Results below reflect audit findings,
//         not execution failures.
//       </p>
//     </section>
//   `;
// }

// function renderLighthousePerformance(lighthouse: any) {
//   if (!lighthouse?.mobile && !lighthouse?.desktop) {
//     return `
//       <section>
//         <h2>Performance (Lighthouse)</h2>
//         <p class="muted">
//           Lighthouse was not executed in this run.
//           Performance decisions must be based on Lighthouse (mobile-first).
//         </p>
//       </section>
//     `;
//   }

//   const renderBlock = (
//     title: string,
//     data: any,
//     authoritative: boolean
//   ) => {
//     if (!data) {
//       return `<p class="muted">${title}: not available</p>`;
//     }

//     // FIX: vitals may exist but contain nulls (mobile runs esp. locally)
//     const vitals = data.vitals ?? {};
//     const scores = data.scores ?? {};

//     const fmt = (v: any, unit = "ms") =>
//       v == null ? `<span class="muted">not triggered</span>` : `${v} ${unit}`;

//     return `
//       <h3>${title}</h3>
//       ${renderMeta(data.meta)}
//       <table class="perf-table">
//         <tr><th>LCP</th><td>${fmt(vitals.lcpMs)}</td></tr>
//         <tr><th>CLS</th><td>${fmt(vitals.cls, "")}</td></tr>
//         <tr><th>INP</th><td>${fmt(vitals.inpMs)}</td></tr>
//         <tr><th>TTFB</th><td><b>${fmt(vitals.ttfbMs)}</b></td></tr>
//         <tr><th>Performance Score</th><td>${scores.performance != null ? scores.performance : "n/a"}</td></tr>
//         <tr><th>SEO Score</th><td>${scores.seo != null ? scores.seo : "n/a"}</td></tr>
//       </table>

//       <h3>LCP Ownership</h3>
//       <ul>
//         <li><strong>Component:</strong> ${lcpOwner?.component}</li>
//         <li><strong>File:</strong> <code>${lcpOwner?.file}</code></li>
//         <li><strong>Type:</strong> ${lcpOwner?.type}</li>
//         <li><strong>Above the fold:</strong> ${lcpOwner?.aboveTheFold ? "Yes" : "No"}</li>
//       </ul>
//       ${authoritative && longTasksMobile && longTasksMobile.tasks && longTasksMobile.tasks.length ? `
//         <h3>Long Tasks (Main Thread)</h3>
//         <table class="perf-table">
//           <thead>
//             <tr>
//               <th>Start (ms)</th>
//               <th>Duration (ms)</th>
//               <th>Task</th>
//               <th>Script</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${longTasksMobile.tasks
//               .map((t: any) => `
//                 <tr>
//                   <td>${t.startTimeMs}</td>
//                   <td>${t.durationMs}</td>
//                   <td>${t.taskName}</td>
//                   <td style="font-size:12px;color:#555;">${
//                     t.scriptUrl && t.scriptUrl !== "unknown"
//                       ? t.scriptUrl.split("/").pop()
//                       : "unattributed"
//                   }</td>
//                 </tr>
//               `)
//               .join("")}
//           </tbody>
//         </table>
//         <p class="muted">Note: long tasks are main-thread tasks longer than 50ms captured by Lighthouse.</p>
//       ` : ""}
//       <p class="muted">
//         Mode: <b>${authoritative ? "AUTHORITATIVE (Release-gating)" : "ADVISORY (Diagnostic only)"}</b>
//       </p>
//       <p class="muted">
//         <i>
//           Note: “not triggered” means Lighthouse did not emit this metric in this mode.
//           This is common on mobile when LCP/INP observers do not fire.
//         </i>
//       </p>
//     `;
//   };

//   const renderMeta = (meta: any) => {
//     if (!meta) return "";

//     const bg =
//       meta.workspace === "CI"
//         ? "#ecfeff"
//         : meta.workspace === "VPS-QA"
//         ? "#fef9c3"
//         : "#f1f5f9";

//     return `
//       <div style="
//         background:${bg};
//         padding:12px 14px;
//         border-radius:8px;
//         margin-bottom:16px;
//         font-size:14px;
//         color:#0f172a;
//       ">
//         <b>Workspace:</b> ${meta.workspace}<br/>
//         <b>Server:</b> ${meta.host}:${meta.port}<br/>
//         <b>URL:</b> ${meta.url}<br/>
//         <b>Collected:</b> ${meta.collectedAt}
//       </div>
//     `;
//   };

//   return `
//     <section>
//       <h2>Performance (Lighthouse)</h2>
//       <p class="muted">
//         Lighthouse results are reported separately for mobile and desktop.
//         Only <b>mobile</b> Lighthouse is authoritative for release gating.
//       </p>

//       ${renderBlock("Mobile (Authoritative)", lighthouse.mobile, true)}
//       ${renderBlock("Desktop (Advisory)", lighthouse.desktop, false)}
//     </section>
//   `;
// }

// function renderPerformanceSection(report: any) {
//   // IMPORTANT:
//   // The canonical metrics live under diagnostics.performance (device-aware).
//   const perf = report.diagnostics?.performance?.data ?? {};
//   const mobile = perf.mobile || {};
//   const desktop = perf.desktop || {};

//   const fmt = (v: any, unit = "ms") =>
//     v == null ? "n/a" : `${v} ${unit}`;

//   return `
//     <section id="performance">
//       <h2>Performance</h2>
//       <table class="perf-table">
//         <thead>
//           <tr><th></th><th>LCP</th><th>CLS</th><th>INP</th><th>TTFB</th></tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td><strong>Mobile</strong></td>
//             <td>${fmt(mobile.lcpMs)}</td>
//             <td>${mobile.cls == null ? "n/a" : mobile.cls}</td>
//             <td>${fmt(mobile.inpMs)}</td>
//             <td>${fmt(mobile.ttfbMs)}</td>
//           </tr>
//           <tr>
//             <td><strong>Desktop</strong></td>
//             <td>${fmt(desktop.lcpMs)}</td>
//             <td>${desktop.cls == null ? "n/a" : desktop.cls}</td>
//             <td>${fmt(desktop.inpMs)}</td>
//             <td>${fmt(desktop.ttfbMs)}</td>
//           </tr>
//         </tbody>
//       </table>
//     </section>
//   `;
// }

// // (Trend handling moved to after JSON report generation)

// /* ---------------- JSON REPORT (Machine) ---------------- */

// jsonReport = {
//   contract: "homepage",
//   workspace: WORKSPACE,
//   indicators: [],
//   diagnostics: {},
//   generatedAt,
// };

// // Ensure these runtime collections exist before binding into the JSON report.
// // They are populated later in the script with diagnostics and indicator signals.
// // --------------------------------------------------
// // Indicator Model (Authoritative)
// // --------------------------------------------------
// // Reuse exported indicator types declared at file top.

// function pushIndicator(
//   a: any,
//   b?: any,
//   c?: any,
//   d?: any,
//   e?: any,
//   f?: any,
//   g?: any
// ) {
//   // Support calling forms:
//   // 1) pushIndicator(list, domain, id, severity, passed, message, evidence)
//   // 2) pushIndicator(domain, id, severity, passed, message, evidence)
//   // 3) pushIndicator({ id, domain, severity, passed, message, evidence })

//   // form (1): explicit list provided
//   if (Array.isArray(a)) {
//     const list = a as IndicatorResult[];
//     const domain = b as IndicatorDomain;
//     const id = c as any;
//     const severity = d as IndicatorSeverity;
//     const passed = e as boolean;
//     const message = f as string;
//     const evidence = g;
//     const result: IndicatorResult = { id, domain, severity, passed, message, evidence } as any;
//     list.push(result);
//     return;
//   }

//   // form (3): single object
//   if (typeof a === "object" && a !== null && !Array.isArray(a)) {
//     const obj = a as any;

//     // Backwards-compatible support for shorthand object shape:
//     // { id, status: 'pass'|'fail', message }
//     // Map to the canonical fields: domain, severity, passed, message, evidence
//     let { id, domain, severity, passed, message, evidence, status } = obj as any;

//     // Infer `passed` from `status` when provided
//     if (typeof passed === "undefined" && typeof status === "string") {
//       passed = status.toLowerCase() === "pass" ? true : status.toLowerCase() === "fail" ? false : undefined;
//     }

//     // Infer severity when missing: failing => error, passing => info
//     if (typeof severity === "undefined") {
//       if (typeof passed === "boolean") {
//         severity = passed ? (obj.severity ?? "info") : (obj.severity ?? "error");
//       } else {
//         severity = obj.severity ?? "info";
//       }
//     }

//     // Infer domain from id if missing
//     if (typeof domain === "undefined" && typeof id === "string") {
//       if (id.toUpperCase().startsWith("PERF")) domain = "performance";
//       else if (id.toUpperCase().startsWith("SEO")) domain = "seo";
//       else if (id.toUpperCase().startsWith("FLOW") || id.toUpperCase().includes("CTA") ) domain = "flow";
//       else domain = obj.domain ?? "seo";
//     }

//     const result: IndicatorResult = { id, domain, severity, passed, message, evidence } as any;
//     // Preserve optional fields if provided
//     if (typeof status === "string") (result as any).status = status;
//     if (typeof (obj as any).blocking !== "undefined") (result as any).blocking = Boolean((obj as any).blocking);
//     indicators.push(result);
//     return;
//   }

//   // form (2): domain, id, severity, passed, message, evidence
//   const domain = a as IndicatorDomain;
//   const id = b as any;
//   const severity = c as IndicatorSeverity;
//   const passed = d as boolean;
//   const message = e as string;
//   const evidence = f;
//   const result: IndicatorResult = { id, domain, severity, passed, message, evidence } as any;
//   indicators.push(result);
// }
// // --------------------------------------------------
// // Semantic SEO Indicators
// // --------------------------------------------------
// function evaluateSemanticSEO({
//   h1Text,
//   aboveFoldText,
// }: {
//   h1Text: string;
//   aboveFoldText: string;
// }) {
//   const h1MentionsRole = /manufacturer|supplier|packaging/i.test(h1Text);
//   const mentionsGeo = /india/i.test(aboveFoldText);
//   const mentionsOffering = /paper|packaging|bags|boxes/i.test(aboveFoldText);

//   const h1ExpressesBusinessRole = h1MentionsRole;
//   const aboveFoldAnswersWhoWhatWhere = mentionsGeo && mentionsOffering;

//   pushIndicator({
//     id: "SEO-SEM-01",
//     status: h1ExpressesBusinessRole ? "pass" : "fail",
//     message: h1ExpressesBusinessRole
//       ? "H1 clearly expresses business role"
//       : "H1 does not clearly express manufacturer / supplier role",
//     meta: { source: "static" },
//   });

//   pushIndicator({
//     id: "SEO-SEM-02",
//     status: aboveFoldAnswersWhoWhatWhere ? "pass" : "fail",
//     message: aboveFoldAnswersWhoWhatWhere
//       ? "Above-fold content answers who / what / where"
//       : "Above-fold content missing offering or geography",
//     meta: { source: "static" },
//   });
// }
// // `diagnostics` initialized near top of file; reuse here.
// const primaryH1: string = "";
// const aboveFoldText: string = "";

// jsonReport.performance = {
//   indicators: indicators.filter((i) => i.domain === "performance"),
// };

// jsonReport.seo = {
//   indicators: indicators.filter((i) => i.domain === "seo"),
// };

// jsonReport.flow = {
//   indicators: indicators.filter((i) => i.domain === "flow"),
// };

// jsonReport.diagnostics = diagnostics;

// // --------------------------------------------------
// // Post-JSON enforcement (safe: jsonReport is now declared)
// // --------------------------------------------------
// (jsonReport as any).diagnostics = {
//   ...diagnostics,
//   lcp: {
//     advisory: false,
//     data: lcpBreakdownMobile ?? null,
//   },
//   longTasks: {
//     advisory: true,
//     data: longTasksMobile ?? null,
//   },
// };

// if (fontDisplayEnforcement) {
//   (jsonReport as any).diagnostics.fontDisplay = fontDisplayEnforcement;

//   if (fontDisplayEnforcement.pass === false) {
//     // Emit structured indicator for font-display enforcement
//     pushIndicator(
//       "performance",
//       "PERF_FONT_DISPLAY_BLOCKING",
//       "error",
//       false,
//       "Blocking fonts detected. Critical fonts must use font-display: swap.",
//       { blockingFonts: fontDisplayEnforcement.blockingFonts }
//     );
//   }
// }

// if (heroPreloadCheck) {
//   (jsonReport as any).diagnostics.lcp.heroImagePreload = heroPreloadCheck;

//   if (heroPreloadCheck.preloaded === false) {
//     // Emit structured indicator for LCP hero image preload enforcement
//     pushIndicator(
//       "performance",
//       "PERF_LCP_IMAGE_NOT_PRELOADED",
//       "error",
//       false,
//       "Hero (LCP) image is not preloaded. Ensure Next.js priority or explicit preload aligns with the fetched URL.",
//       { image: heroPreloadCheck.lcpImage }
//     );
//   }
// }

// // Hard fail if any enforcement errors were recorded (governance gate)
// const perfEnforcementErrors = indicators.filter(
//   (i) => i.domain === "performance" && i.severity === "error" && !i.passed
// );
// if (perfEnforcementErrors.length) {
//   // Replace hard throw with a structured indicator for tooling/CI
//   pushIndicator({
//     id: "PERF_ENFORCEMENT_FAILED",
//     status: "fail",
//     message: `Performance enforcement failed: ${perfEnforcementErrors
//       .map((e: any) => e.id)
//       .join(", ")}`,
//     evidence: { ids: perfEnforcementErrors.map((e: any) => e.id) },
//   });
// }

// // ---------------- LCP Diagnostics (Attach BEFORE rendering) ----------------
// (jsonReport as any).diagnostics = (jsonReport as any).diagnostics || {};
// const MOBILE_CPU_MULTIPLIER = 4; // must match Lighthouse config
// let renderMathMobile: any = null;
// // `indicators` declared earlier; reuse it here.


// // ===== Canonical LCP Decomposition (Authoritative) =====
// // Compute canonical LCP decomposition facts from the raw Lighthouse LHR.
// // This block only computes facts — no throws or verdict logic here.
// const _lhr = rawLighthouseMobile?.lhr ?? rawLighthouseMobile ?? null;
// const _audits = _lhr?.audits ?? {};

// const canonicalMobileLcpMs =
//   _audits["largest-contentful-paint"]?.numericValue ?? null;

// const ttfbMs =
//   _audits["server-response-time"]?.numericValue ?? 0;

// const resourceLoadDelayMs =
//   _audits["lcp-resource-load-delay"]?.numericValue ?? 0;

// const resourceLoadTimeMs =
//   _audits["lcp-resource-load-time"]?.numericValue ?? 0;

// const renderDelayMs =
//   _audits["lcp-render-delay"]?.numericValue ??
//   Math.max(
//     0,
//     (canonicalMobileLcpMs ?? 0) - ttfbMs - resourceLoadDelayMs - resourceLoadTimeMs
//   );

// // Attach canonical facts to diagnostics (no verdicts here)
// diagnostics.lcp = diagnostics.lcp || {};
// diagnostics.lcp.data = {
//   lcpMs: canonicalMobileLcpMs,
//   ttfbMs,
//   resourceLoadDelayMs,
//   resourceLoadTimeMs,
//   renderDelayMs,
// };

// // Attach LCP phase breakdowns (device-aware, diagnostics only)
// diagnostics.lcpPhaseBreakdown = diagnostics.lcpPhaseBreakdown || {
//   advisory: true,
//   data: lcpPhaseBreakdown,
// };

// // Mobile root-cause (diagnostics only, factual)
// if (lcpPhaseBreakdown.mobile && lcpPhaseBreakdown.mobile.dominantPhase === "render") {
//   diagnostics.lcpPhaseBreakdown.rootCauseMobile =
//     "LCP is dominated by render-phase work occurring after resource load completion.";
// }

// // PERF-01 emission is handled by the canonical resolver in `resolveEvidence`.

// diagnostics.longTasks = diagnostics.longTasks || {};
// // Classify long tasks for diagnostics (preserve original fields)
// if (longTasksMobile) {
//   const rawLongTasks = longTasksMobile.tasks ?? [];
//   const classifiedLongTasks = rawLongTasks.map((t: any) => ({
//     ...t,
//     ...(classifyLongTask({ start: t.startTimeMs ?? t.start, duration: t.durationMs ?? t.duration } as any)),
//   }));

//   diagnostics.longTasks.data = {
//     totalBlockingMs: longTasksMobile.totalBlockingMs,
//     tasks: classifiedLongTasks,
//   };
//   // Derive an LCP root-cause from the raw Lighthouse JSON and attach
//   // as advisory diagnostics for reporting/triage.
//   const lcpRootCause = rawLighthouseMobile
//     ? deriveLcpRootCauseFromLighthouse(rawLighthouseMobile.lhr ?? rawLighthouseMobile)
//     : null;

//   if (lcpRootCause) {
//     diagnostics.lcpRootCause = {
//       advisory: true,
//       data: lcpRootCause,
//     };
//   }
// } else {
//   diagnostics.longTasks.data = null;
// }
// // Replace implicit failure mutation with a structured indicator
// if (canonicalMobileLcpMs != null) {
//   if (canonicalMobileLcpMs <= 2500) {
//     pushIndicator({
//       id: "PERF_LCP_THRESHOLD",
//       status: "pass",
//       message: "LCP within threshold",
//       evidence: { valueMs: canonicalMobileLcpMs, thresholdMs: 2500, source: "lighthouse.mobile" },
//     });
//   } else {
//     pushIndicator({
//       id: "PERF_LCP_THRESHOLD",
//       status: "fail",
//       message: `LCP exceeded: ${Math.round(canonicalMobileLcpMs)}ms`,
//       evidence: { valueMs: canonicalMobileLcpMs, thresholdMs: 2500, source: "lighthouse.mobile" },
//     });
//   }
// } else {
//   pushIndicator({
//     id: "PERF_LCP_THRESHOLD",
//     status: "fail",
//     message: "LCP unavailable",
//     evidence: { valueMs: null, thresholdMs: 2500, source: "lighthouse.mobile" },
//   });
// }

// if (
//   lcpBreakdownMobile &&
//   typeof lcpBreakdownMobile.attribution?.renderDelayMs === "number"
// ) {
//   if (lcpBreakdownMobile.attribution.renderDelayMs != null) {
//     indicators.push({
//       id: "PERF_LCP_RENDER_DELAY",
//       domain: "performance",
//       severity: "warn",
//       passed: lcpBreakdownMobile.attribution.renderDelayMs <= 1500,
//       message:
//         lcpBreakdownMobile.attribution.renderDelayMs <= 1500
//           ? "LCP render delay acceptable"
//           : `Render delay dominates LCP (${lcpBreakdownMobile.attribution.renderDelayMs}ms)`,
//       evidence: {
//         renderDelayMs: lcpBreakdownMobile.attribution.renderDelayMs,
//         lcpMs: canonicalMobileLcpMs,
//       },
//     });

//     diagnostics.lcp.data = lcpBreakdownMobile;
//   }
// }
// indicators.push({
//   id: "SEO_PRIMARY_H1_INTENT",
//   domain: "seo",
//   severity: "error",
//   passed: /manufacturer|supplier|packaging/i.test(primaryH1),
//   message: "Primary H1 expresses business role",
//   evidence: { h1: primaryH1 },
// });

// // Additional SEO indicators (more specific checks)
// const heroText = (aboveFoldText || "").slice(0, 200).toLowerCase();

// pushIndicator({
//   id: "SEO_H1_BUSINESS_ROLE",
//   domain: "seo",
//   severity: "error",
//   passed: Boolean((primaryH1 || "").match(/manufacturer|supplier|producer/i)),
//   message: "H1 must describe business role clearly",
//   evidence: { h1Text: primaryH1 },
// });

// pushIndicator({
//   id: "SEO_ABOVE_FOLD_CLARITY",
//   domain: "seo",
//   severity: "warn",
//   passed: Boolean(
//     (aboveFoldText || "").match(/paper|packaging/i) &&
//     (aboveFoldText || "").match(/india/i)
//   ),
//   message: "Above-fold copy should state offering + geography",
//   evidence: { aboveFoldText },
// });
// // Attach indicators to the machine-readable report
// (jsonReport as any).indicators = indicators;
// if (lcpBreakdownMobile) {
//   (jsonReport as any).diagnostics.lcp.data = {
//     ...lcpBreakdownMobile,
//     owner: lcpOwner,
//   };

//   (jsonReport as any).diagnostics.lcp.renderSplit =
//     splitRenderDelay(lcpBreakdownMobile);
//   const renderDelaySplitMobile =
//     lcpBreakdownMobile?.attribution?.renderDelayMs != null
//       ? splitRenderDelayAttribution({
//           totalRenderDelayMs:
//             lcpBreakdownMobile.attribution.renderDelayMs,
//           imageLoadMs:
//             lcpBreakdownMobile.attribution.resourceLoadTimeMs ?? null,
//           fontEstimateMs: PRELOAD_FONT_ESTIMATE_MS,
//         })
//       : null;

//   (jsonReport as any).diagnostics.lcp.renderDelayAttribution =
//     deriveRenderDelayAttribution(lcpBreakdownMobile);

//   renderMathMobile =
//     renderDelaySplitMobile
//       ? deriveRenderDelayMath({
//           imageDecodeMs: renderDelaySplitMobile.imageDecodeMs,
//           cssLayoutMs: renderDelaySplitMobile.cssLayoutMs,
//           fontMs: renderDelaySplitMobile.fontMs,
//           jsMs: 0,
//           cpuMultiplier: MOBILE_CPU_MULTIPLIER,
//         })
//       : null;

//   if (renderDelaySplitMobile) {
//     (jsonReport as any).diagnostics.lcp.renderDelaySplit = {
//       imageDecodeMs: renderDelaySplitMobile.imageDecodeMs,
//       cssLayoutMs: renderDelaySplitMobile.cssLayoutMs,
//       fontMs: renderDelaySplitMobile.fontMs,
//       source: "lighthouse.lcp.renderDelay",
//       note:
//         "Image decode from resourceLoadTimeMs. Font cost is a conservative estimate. CSS/layout is remainder.",
//     };
//   }
// } else {
//   // Make absence explicit so HTML can show a helpful note (instead of silently hiding)
//   (jsonReport as any).diagnostics.lcp.data = null;
//   (jsonReport as any).diagnostics.lcp.unavailableReason =
//     "Lighthouse JSON did not include LCP audit `details.items[0]` (runner may be trimming LHR).";
// }

// if (longTasksMobile) {
//   const classifiedLongTasks = (longTasksMobile.tasks || []).map((t: any) => ({
//     ...t,
//     category:
//       (t.durationMs ?? 0) > 200
//         ? "style/layout"
//         : (t.url ?? t.scriptUrl ?? "").includes(".woff")
//         ? "font-loading"
//         : (t.url ?? t.scriptUrl ?? "").includes(".avif")
//         ? "image-decode"
//         : "js-execution",
//   }));

//   (jsonReport as any).diagnostics.longTasks.data = classifiedLongTasks;
// }

// if (heroPreloadCheck) {
//   (jsonReport as any).diagnostics.lcp.heroImagePreload =
//     heroPreloadCheck;

//   if (!heroPreloadCheck.preloaded) {
//     // Emit structured indicator for LCP hero image preload enforcement
//     pushIndicator(
//       "performance",
//       "PERF_LCP_IMAGE_NOT_PRELOADED",
//       "error",
//       false,
//       "Hero (LCP) image is not preloaded. Use <link rel='preload' as='image'> or Next.js priority.",
//       { image: heroPreloadCheck.lcpImage }
//     );
//     // Replace hard throw with an indicator (enforcement recorded)
//     pushIndicator({
//       id: "PERF_LCP_IMAGE_NOT_PRELOADED_ENFORCEMENT",
//       status: "fail",
//       message: "LCP hero image preload enforcement failed",
//       evidence: { image: heroPreloadCheck.lcpImage },
//     });
//   }
// }

// if (fontDisplayEnforcement) {
//   (jsonReport as any).diagnostics.fontDisplay =
//     fontDisplayEnforcement;

//   if (!fontDisplayEnforcement.pass) {
//     // Emit structured indicator for font-display enforcement
//     pushIndicator(
//       "performance",
//       "PERF_FONT_DISPLAY_BLOCKING",
//       "error",
//       false,
//       "Blocking fonts detected. All critical fonts must use font-display: swap.",
//       { blockingFonts: fontDisplayEnforcement.blockingFonts }
//     );
//     // Replace hard throw with an indicator (enforcement recorded)
//     pushIndicator({
//       id: "PERF_FONT_DISPLAY_ENFORCEMENT_FAILED",
//       status: "fail",
//       message: `Font-display enforcement failed (${fontDisplayEnforcement.blockingCount} blocking fonts)`,
//       evidence: { blockingCount: fontDisplayEnforcement.blockingCount, blockingFonts: fontDisplayEnforcement.blockingFonts },
//     });
//   }

//   if (renderMathMobile) {
//     (jsonReport as any).diagnostics.lcp.renderMath = {
//       cpuMultiplier: MOBILE_CPU_MULTIPLIER,
//       rows: renderMathMobile,
//       note:
//         "Effective delay = estimated real CPU time × Lighthouse CPU slowdown multiplier.",
//     };
//   }
// }


// fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
// // JSON will be written after all mutations (render-delay + drift)

// /* ---------------- PERF TREND (Append-only) ---------------- */

// let trend: any[] = [];
// if (fs.existsSync(trendOut)) {
//   try {
//     trend = JSON.parse(fs.readFileSync(trendOut, "utf-8"));
//   } catch {
//     trend = [];
//   }
// }

// const entry = {
//   at: generatedAt,
//   status,
//   perf,
//   analysis: lighthouse?.mobile?.analysis ?? null,
// };
// trend.push(entry);
// fs.writeFileSync(trendOut, JSON.stringify(trend, null, 2));


// // Regression guard: flag large LCP render/decode delays
// const RENDER_DELAY_THRESHOLD_MS =
//   Number(process.env.LCP_RENDER_DELAY_THRESHOLD_MS ?? 1500);

// const lcpBreakdownForGuard = (jsonReport as any).diagnostics?.lcp?.data ?? null;

// if (
//   lcpBreakdownForGuard &&
//   typeof lcpBreakdownForGuard.attribution?.renderDelayMs === "number"
// ) {
//     if (lcpBreakdownForGuard.attribution.renderDelayMs > RENDER_DELAY_THRESHOLD_MS) {
//       // Emit advisory indicator for render delay dominance (non-blocking)
//       pushIndicator({
//         id: "PERF_LCP_RENDER_DELAY_EXCEEDED",
//         domain: "performance",
//         severity: "warn",
//         blocking: false,
//         message: "Render delay dominates mobile LCP (>50%). Informational only.",
//         evidence: { valueMs: lcpBreakdownForGuard.attribution.renderDelayMs, thresholdMs: RENDER_DELAY_THRESHOLD_MS },
//       });
//     }
// }

// // Enforce LCP via indicators only (no throws / no early exit)
// // Uses render-delay dominance as the primary gating signal.
// const LCP_RENDER_DELAY_THRESHOLD = Number(
//   process.env.LCP_RENDER_DELAY_THRESHOLD_MS ?? RENDER_DELAY_THRESHOLD_MS
// );
// if (
//   lcpBreakdownForGuard &&
//   typeof lcpBreakdownForGuard.attribution?.renderDelayMs === "number"
// ) {
//   const resourceLoadDelayMs = lcpBreakdownForGuard.attribution.resourceLoadDelayMs ?? null;
//   const resourceLoadTimeMs = lcpBreakdownForGuard.attribution.resourceLoadTimeMs ?? null;
//   const renderDelayMs = lcpBreakdownForGuard.attribution.renderDelayMs;
//   // PERF-01 emission is handled by the canonical resolver in `resolveEvidence`.
// }

// /* ---------------- DRIFT DETECTION ----------------
//    Fail if performance regresses too much vs previous run (even if within budget)
// */
// const prev = trend.length >= 2 ? trend[trend.length - 2] : null;
// const driftGuard = { lcpMs: 200, inpMs: 50, cls: 0.02 };

// const prevPhase = prev?.analysis?.phases ?? null;
// const currentPhase = lighthouse?.mobile?.analysis?.phases ?? null;

// const drift = prev
//   ? {
//       lcpMs: perf.lcpMs != null && prev.perf?.lcpMs != null ? perf.lcpMs - prev.perf.lcpMs : null,
//       lcpPct:
//         perf.lcpMs != null && prev.perf?.lcpMs
//           ? (perf.lcpMs - prev.perf.lcpMs) / prev.perf.lcpMs
//           : null,
//       inpMs: perf.inpMs != null && prev.perf?.inpMs != null ? perf.inpMs - prev.perf.inpMs : null,
//       cls: perf.cls != null && prev.perf?.cls != null ? Number((perf.cls - prev.perf.cls).toFixed(3)) : null,
//     }
//   : null;

// let performanceRegressionDetected = false;
// if (drift) {
//   const phaseFlip =
//     currentPhase?.isRenderDominated !== undefined &&
//     prevPhase?.isRenderDominated !== undefined &&
//     currentPhase.isRenderDominated !== prevPhase.isRenderDominated;

//   const lcpRegress =
//     drift.lcpPct != null &&
//     drift.lcpPct > 0 &&
//     (drift.lcpPct > 0.2 || phaseFlip);
//   const inpRegress = drift.inpMs != null && drift.inpMs > driftGuard.inpMs;
//   const clsRegress = drift.cls != null && drift.cls > driftGuard.cls;

//   if (lcpRegress || inpRegress || clsRegress) {
//     console.error("? Performance drift regression detected:", drift, "Guard:", driftGuard, "PhaseFlip:", phaseFlip);

//     // Downgrade verdict but do not abort HTML generation
//     (jsonReport as any).verdict = "APPROVED_WITH_WARNINGS";

//     // Emit structured indicator for performance regression
//     pushIndicator(
//       "performance",
//       "PERF_REGRESSION",
//       "warn",
//       false,
//       "Performance regression detected vs previous run",
//       { regression: drift, guard: driftGuard, phaseFlip }
//     );

//     performanceRegressionDetected = true;

//     // CI may opt-in to hard-fail on perf regressions
//     if (process.env.FAIL_ON_PERF_REGRESSION === "1") {
//       // CI hard-fail replaced by a recorded indicator (no throw)
//       pushIndicator({
//         id: "PERF_REGRESSION_CI_HARDFAIL",
//         status: "fail",
//         message: "Performance regression (CI hard-fail)",
//         evidence: { regression: drift, guard: driftGuard, phaseFlip },
//       });
//     }
//   }
// }

//   // --------------------------------------------------
//   // PERF CONTRACT — Mobile LCP MUST NOT be an image
//   // --------------------------------------------------

//   if (lcpBreakdownMobile) {
//     const imageLcp = isImageLcp(lcpBreakdownMobile);

//     pushIndicator({
//       id: "PERF-01-MOBILE-LCP-NOT-IMAGE",
//       domain: "performance",
//       severity: "error",
//       blocking: true,
//       passed: !imageLcp,
//       message: imageLcp
//         ? "Mobile LCP element must not be an image"
//         : "Mobile LCP element is non-image (compliant)",
//       evidence: {
//         tag: lcpBreakdownMobile.lcpElement?.tagName ?? null,
//         selector: lcpBreakdownMobile.element?.selector ?? null,
//         resource: lcpBreakdownMobile.resource?.url ?? null,
//         source: "lighthouse.lcp-element",
//       },
//     });
//   }

//   let verdict = deriveVerdictFromIndicators(indicators);
// if (performanceRegressionDetected) {
//   verdict = "APPROVED_WITH_WARNINGS";
// }

// // Persist JSON after render-delay and drift mutations so it reflects final state
// // Bind final runtime collections so JSON reflects latest diagnostics/indicators
// jsonReport.indicators = indicators;
// jsonReport.diagnostics = diagnostics;
// jsonReport.verdict = verdict;

// fs.writeFileSync(jsonOut, JSON.stringify(jsonReport, null, 2));

// /* ---------------- HTML REPORT (Human) ---------------- */

// const statusColor = status === "PASSED" ? "#16a34a" : "#dc2626";

// // Diagnostics (separate from typed summary)
// // diagnostics already populated higher; transform longTasks into diagnostics.data
// diagnostics["longTasks"] = longTasksMobile
//   ? {
//       advisory: true,
//       data: {
//         totalBlockingMs: longTasksMobile.totalBlockingMs,
//         tasks: (longTasksMobile.tasks || []).map((t: any) => {
//           const cls = classifyLongTask({ start: t.startTimeMs ?? t.start, duration: t.durationMs ?? t.duration });
//           return {
//             startMs: t.startTimeMs ?? t.startMs ?? null,
//             durationMs: t.durationMs,
//             category: cls?.category ?? "js-execution",
//             likelyCause: cls?.likelyCause ?? "JavaScript execution",
//           };
//         }),
//       },
//     }
//   : { advisory: true, data: null };

// const lcpBreakdown = jsonReport.diagnostics?.lcp?.data ?? null;
// const longTasks = jsonReport.diagnostics?.longTasks?.data ?? null;
// const lcpBlockingTasks =
//   lcpBreakdown && longTasks ? correlateTasksToLCP(longTasks, lcpBreakdown) : [];
// const lcpPhaseBreakdownDiag = jsonReport.diagnostics?.lcpPhaseBreakdown?.data ?? {};
// const rootCauseMobile = jsonReport.diagnostics?.lcpPhaseBreakdown?.rootCauseMobile ?? null;
// const diagnosticEntries = Object.entries(jsonReport.diagnostics || {})
//   .filter(([_, diag]: any) => diag)
//   .map(([id, diag]: any) => {
//     const advisory = Boolean(diag?.advisory);
//     return {
//       id,
//       pillar: advisory ? "advisory" : "performance",
//       severity: advisory ? "info" : "warn",
//       message:
//         diag?.message ??
//         diag?.note ??
//         (diag?.unavailableReason ?? "Diagnostic data available"),
//     };
//   });

// const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <title>GreenPax Homepage Contract Report</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <style>
//     body {
//       font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
//       background: #f8fafc;
//       margin: 0;
//       padding: 24px;
//       color: #0f172a;
//     }
//     .container {
//       max-width: 960px;
//       margin: auto;
//       background: #ffffff;
//       padding: 24px 32px;
//       border-radius: 10px;
//       box-shadow: 0 10px 25px rgba(0,0,0,0.06);
//     }
//     h1 {
//       margin-top: 0;
//     }
//     .status {
//       font-size: 20px;
//       font-weight: 700;
//       color: ${statusColor};
//     }
//     .meta {
//       color: #475569;
//       font-size: 14px;
//       margin-bottom: 24px;
//     }
//     .workspace-note {
//       font-size: 13px;
//       color: #475569;
//       margin-top: 8px;
//     }
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-top: 12px;
//     }
//     th, td {
//       padding: 10px 12px;
//       border-bottom: 1px solid #e5e7eb;
//       text-align: left;
//     }
//     th {
//       background: #f1f5f9;
//       font-weight: 600;
//     }
//     .pass {
//       color: #16a34a;
//       font-weight: 600;
//     }
//     .fail {
//       color: #dc2626;
//       font-weight: 600;
//     }
//     .section {
//       margin-top: 32px;
//     }
//     .pillars span {
//       display: inline-block;
//       margin-right: 16px;
//       font-weight: 600;
//     }
//     .evidence-table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-top: 16px;
//     }
//     .evidence-table th,
//     .evidence-table td {
//       padding: 10px 12px;
//       border-bottom: 1px solid #e5e7eb;
//     }
//     .evidence-table th {
//       background: #f8fafc;
//     }
//   </style>

//   <style>
//     /* LCP Breakdown — scoped styles */
//     #lcp-breakdown {
//       margin-top: 24px;
//       padding-top: 12px;
//       border-top: 2px solid #eee;
//     }
//     #lcp-breakdown table {
//       border-collapse: collapse;
//       margin: 12px 0 16px;
//       width: 100%;
//       max-width: 560px;
//     }
//     #lcp-breakdown th,
//     #lcp-breakdown td {
//       border: 1px solid #ddd;
//       padding: 6px 10px;
//       text-align: left;
//     }
//     #lcp-breakdown th {
//       background: #fafafa;
//     }
//     #lcp-breakdown .dominant {
//       color: #b00020;
//       font-weight: bold;
//     }
//     #lcp-breakdown .interpretation {
//       color: #555;
//       margin-top: 8px;
//       font-style: italic;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <h1>GreenPax Homepage — Contract Validation Report</h1>
    
//     <div class="meta">
//       <b>Workspace:</b>
//       <span style="
//         display:inline-block;
//         padding:4px 10px;
//         border-radius:999px;
//         background:#0f172a;
//         color:#ffffff;
//         font-weight:600;
//         margin-left:6px;
//       ">
//         ${WORKSPACE}
//       </span>
//     </div>

//     ${renderExecutionStatus()}
//     <div class="meta">
//       Contract: <b>homepage</b><br/>
//       Generated at: ${generatedAt}
//     </div>

//     <div class="section">
//       <h2>Contract Checks (Resolved)</h2>
//       <p style="color:#475569;font-size:14px;margin-top:8px;margin-bottom:0;">
//         This table is the authoritative merge of registry checks × runtime evidence.
//         Result <code>NOT_RUN</code> means no runtime evidence was emitted for that check.
//       </p>

//       ${Object.entries(checks)
//         .map(([pillar, rules]) => {
//           const rows = (rules as any[])
//             .map((r: any) => {
//               const cls =
//                 r.result === "PASS" ? "pass" : r.result === "FAIL" ? "fail" : "";
//               return `
//                 <tr>
//                   <td>${r.id}</td>
//                   <td>${r.label}</td>
//                   <td class="${cls}">${r.result}</td>
//                   <td>${String(r.severity ?? "info").toUpperCase()}</td>
//                   <td style="color:#64748b;">${r.source ?? ""}</td>
//                 </tr>
//               `;
//             })
//             .join("");

//           return `
//             <h3>${pillar.toUpperCase()}</h3>
//             <table class="evidence-table">
//               <tr>
//                 <th>Check ID</th>
//                 <th>Description</th>
//                 <th>Result</th>
//                 <th>Severity</th>
//                 <th>Source</th>
//               </tr>
//               ${rows}
//             </table>
//           `;
//         })
//         .join("")}
//     </div>

//     <!-- Legacy flat Contract Evidence section removed. Canonical source is now "Contract Checks (Resolved)". -->
//     ${renderPlaywrightPerformanceNote()}${renderLighthousePerformance(jsonReport.lighthouse)}

//     ${renderPerformanceSection(jsonReport)}

//     ${
//       diagnosticEntries.length
//         ? `
//     <section>
//       <h2>Diagnostics (Non-Blocking)</h2>
//       <p class="muted">
//         Diagnostics explain performance behavior and do NOT affect contract verdict.
//       </p>
//       <table class="evidence-table">
//         <tr>
//           <th>ID</th><th>Pillar</th><th>Severity</th><th>Message</th>
//         </tr>
//         ${diagnosticEntries
//           .map(
//             (d: any) => `
//         <tr>
//           <td><code>${d.id}</code></td>
//           <td>${d.pillar}</td>
//           <td>${d.severity}</td>
//           <td>${d.message}</td>
//         </tr>`
//           )
//           .join("")}
//       </table>
//     </section>
//     `
//         : ""
//     }

//   ${
//       lcpBreakdown
//         ? `
//     <section id="lcp-breakdown">
//       <h2>⏱ LCP Breakdown (Mobile – Authoritative)</h2>

//       <p>
//         <strong>Total LCP:</strong>
//         ${lcpBreakdown.totalLcpMs} ms
//       </p>

//       <table>
//         <thead>
//           <tr>
//             <th>Phase</th>
//             <th>Time (ms)</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>TTFB</td>
//             <td>${lcpBreakdown.ttfbMs}</td>
//           </tr>
//           <tr>
//             <td>Resource request delay</td>
//             <td>${lcpBreakdown.attribution.resourceLoadDelayMs}</td>
//           </tr>
//           <tr>
//             <td>Resource download time</td>
//             <td>${lcpBreakdown.attribution.resourceLoadTimeMs}</td>
//           </tr>
//           <tr>
//             <td><strong>Render / decode delay</strong></td>
//             <td class="dominant">${lcpBreakdown.attribution.renderDelayMs}</td>
//           </tr>
//         </tbody>
//       </table>

//       <h3>LCP Element</h3>
//       <ul>
//         <li>
//           <strong>Tag:</strong>
//           ${lcpBreakdown.lcpElement?.tagName ?? "n/a"}
//         </li>
//         <li>
//           <strong>Selector:</strong>
//           ${lcpBreakdown.element?.selector ?? "n/a"}
//         </li>
//         <li>
//           <strong>Resource:</strong>
//           ${lcpBreakdown.resource?.url ?? "n/a"}
//         </li>
//       </ul>

//       <p class="interpretation">
//         <em>
//           Interpretation: Render-phase time is reported separately from TTFB and resource load based on Lighthouse metrics.
//         </em>
//       </p>
//     </section>
//     `
//         : ""
//     }
//     ${
//       lcpPhaseBreakdownDiag.mobile
//         ? `
//     <section id="lcp-phase-breakdown">
//       <h2>Phase Breakdown (Mobile vs Desktop)</h2>
//       <table>
//         <thead>
//           <tr>
//             <th></th>
//             <th>LCP</th>
//             <th>TTFB</th>
//             <th>Resource load</th>
//             <th>Render-phase delay</th>
//             <th>Dominant phase</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td><strong>Mobile</strong></td>
//             <td>${lcpPhaseBreakdownDiag.mobile.lcpMs} ms</td>
//             <td>${lcpPhaseBreakdownDiag.mobile.ttfbMs} ms</td>
//             <td>${lcpPhaseBreakdownDiag.mobile.resourceLoadMs} ms</td>
//             <td>${lcpPhaseBreakdownDiag.mobile.renderPhaseMs} ms</td>
//             <td>${lcpPhaseBreakdownDiag.mobile.dominantPhase}</td>
//           </tr>
//           ${
//             lcpPhaseBreakdownDiag.desktop
//               ? `
//           <tr>
//             <td><strong>Desktop</strong></td>
//             <td>${lcpPhaseBreakdownDiag.desktop.lcpMs} ms</td>
//             <td>${lcpPhaseBreakdownDiag.desktop.ttfbMs} ms</td>
//             <td>${lcpPhaseBreakdownDiag.desktop.resourceLoadMs} ms</td>
//             <td>${lcpPhaseBreakdownDiag.desktop.renderPhaseMs} ms</td>
//             <td>${lcpPhaseBreakdownDiag.desktop.dominantPhase}</td>
//           </tr>`
//               : ""
//           }
//         </tbody>
//       </table>
//       ${
//         rootCauseMobile
//           ? `<p class="interpretation"><em>${rootCauseMobile}</em></p>`
//           : ""
//       }
//     </section>
//     `
//         : ""
//     }
//   ${
//     diagnostics.renderDelayAttribution
//       ? `
//  <section>
//    <h3>📐 Render Delay Attribution (Derived)</h3>
//    <p class="muted">
//      Governed approximation derived from Lighthouse renderDelay,
//      mobile CPU throttling, and known decode/layout costs.
//    </p>
//    <table>
//      <thead>
//        <tr>
//          <th>Source</th>
//          <th>Estimated Time (ms)</th>
//          <th>Rationale</th>
//        </tr>
//      </thead>
//      <tbody>
//        ${diagnostics.renderDelayAttribution
//          .map(
//            (r: any) => `
//          <tr>
//            <td>${r.source}</td>
//            <td>${r.estimatedMs}</td>
//            <td>${r.rationale}</td>
//          </tr>`
//          )
//          .join("")}
//      </tbody>
//    </table>
//  </section>
//  `
//       : ""
//   }
//   ${
//     diagnostics.lcpRootCause
//       ? `
//     <section id="lcp-rootcause">
//       <h3>LCP Root Cause (Derived from Lighthouse)</h3>
//       <p class="muted">Derived advisory artifact from Lighthouse LHR (for triage).</p>
//       <pre style="background:#f1f5f9;padding:12px;border-radius:8px;overflow:auto;"><code>${escapeHtml(diagnostics.lcpRootCause.data)}</code></pre>
//     </section>
//     `
//       : ""
//   }
//   ${
//     longTasks
//       ? `
//     <section id="long-tasks">
//       <h2>🧵 Main-Thread Long Tasks (Mobile)</h2>

//       <p>
//         <strong>Total blocking time:</strong>
//         ${longTasks.totalBlockingMs} ms
//       </p>
//       <h4>Blocking scripts</h4>
//       <table>
//         <thead>
//           <tr>
//             <th>Script</th>
//             <th>Blocking time</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${renderLongTaskAttribution(longTasks.tasks)}
//         </tbody>
//       </table>

//       <table>
//         <thead>
//           <tr>
//             <th>Duration (ms)</th>
//             <th>Start Time (ms)</th>
//             <th>Source</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${longTasks.tasks
//             .map(
//               (t: any) => `
//             <tr>
//               <td>${t.durationMs}</td>
//               <td>${t.startTimeMs}</td>
//               <td>${t.url}</td>
//             </tr>
//           `
//             )
//             .join("")}
//         </tbody>
//       </table>

//       <p class="interpretation">
//         Long tasks during LCP indicate blocking JavaScript or style calculation.
//         For a fully static homepage, this should trend toward zero.
//       </p>
//     </section>
//     `
//       : ""
//   }

//   ${
//     lcpBlockingTasks && lcpBlockingTasks.length > 0
//       ? `
//       <section>
//         <h3>🚨 Tasks Blocking LCP Paint</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Start</th>
//               <th>Duration</th>
//               <th>Top script</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${lcpBlockingTasks
//               .map((t: any) => `
//               <tr>
//                 <td>${Math.round(t.startTimeMs)} ms</td>
//                 <td>${Math.round(t.durationMs)} ms</td>
//                 <td>${(t.url || "unknown").split("/").pop() ?? "unknown"}</td>
//               </tr>
//             `)
//               .join("")}
//           </tbody>
//         </table>
//       </section>
//     `
//       : ""
//   }
//     <section class="workspace-note">
//       <p>
//         Interpretation context:
//         <b>${WORKSPACE}</b> workspace.
//         Performance and Lighthouse signals may be advisory or authoritative
//         depending on workspace policy.
//       </p>
//     </section>

//     <div class="section">
//       <h2>Performance (Playwright Audit)</h2>
//       <p style="color:#475569;font-size:14px;margin-top:8px;margin-bottom:0;">
//         These are best-effort metrics captured during Playwright runs. Values may be <code>n/a</code>.
//         Performance decisions should be based on Lighthouse (mobile-first).
//       </p>
//       <table class="evidence-table">
//         <tr>
//           <th>Metric</th>
//           <th>Measured</th>
//           <th>Budget</th>
//         </tr>
//         <tr>
//           <td>LCP</td>
//           <td>${perf.lcpMs == null ? "n/a" : `${perf.lcpMs} ms`}</td>
//           <td>≤ 2500 ms</td>
//         </tr>
//         <tr>
//           <td>CLS</td>
//           <td>${perf.cls == null ? "n/a" : `${perf.cls}`}</td>
//           <td>≤ 0.1</td>
//         </tr>
//         <tr>
//           <td>INP</td>
//           <td>${perf.inpMs == null ? "n/a" : `${perf.inpMs} ms`}</td>
//           <td>≤ 200 ms</td>
//         </tr>
//       </table>

//       ${perf.lcpElement ? `
//       <section class="contract-section">
//         <h3>Largest Contentful Paint Element</h3>
//         <table>
//           <tr><th>Selector</th><td><code>${perf.lcpElement.selector}</code></td></tr>
//           ${perf.lcpElement.nodeLabel ? `<tr><th>Label</th><td>${perf.lcpElement.nodeLabel}</td></tr>` : ""}
//           ${perf.lcpElement.snippet ? `<tr><th>Snippet</th><td><code>${perf.lcpElement.snippet}</code></td></tr>` : ""}
//         </table>
//       </section>
//       ` : ""}

//       <p style="color:#475569;font-size:14px;margin-top:10px;">
//         Trend file: <code>homepage.perf.trend.json</code>
//         ${drift ? ` | Drift vs previous: LCP ${drift.lcpMs ?? "n/a"} ms, CLS ${drift.cls ?? "n/a"}, INP ${drift.inpMs ?? "n/a"} ms` : ""}
//       </p>
//     </div>

//     <div class="section">
//       <h2>Summary</h2>
//       <table>
//         <tr><th>Total Tests</th><td>${total}</td></tr>
//         <tr><th>Passed</th><td class="pass">${passed}</td></tr>
//         <tr><th>Failed</th><td class="${failed === 0 ? "pass" : "fail"}">${failed}</td></tr>
//         <tr><th>Skipped</th><td>${skipped}</td></tr>
//         <tr><th>Flaky</th><td>${flaky}</td></tr>
//         <tr><th>Duration</th><td>${Math.round(stats.duration ?? 0)} ms</td></tr>
//       </table>
//     </div>

//     <div class="section">
//       <h2>Validation Pillars</h2>
//       <div class="pillars">
//         <span>SEO: <span class="${pillars.seo === "PASS" ? "pass" : "fail"}">${pillars.seo}</span></span>
//         <span>Schema: <span class="${pillars.schema === "PASS" ? "pass" : "fail"}">${pillars.schema}</span></span>
//         <span>Intent: <span class="${pillars.intent === "PASS" ? "pass" : "fail"}">${pillars.intent}</span></span>
//         <span>CTA Flow: <span class="${pillars.cta_flow === "PASS" ? "pass" : "fail"}">${pillars.cta_flow}</span></span>
//       </div>
//     </div>

//     <section>
//       <h2>Contract Verdict</h2>
//       <p class="verdict ${verdict.toLowerCase()}">${verdict}</p>
//       <p class="muted">
//         Verdict is derived ONLY from <code>indicators[]</code>.
//         Diagnostics never affect pass/fail.
//       </p>

//     <section class="section">
//       <h2>Indicators (Authoritative)</h2>
//       <table class="evidence-table">
//         <tr>
//           <th>ID</th><th>Domain</th><th>Severity</th><th>Status</th><th>Message</th>
//         </tr>
//         ${indicators.map(i => `
//           <tr>
//             <td><code>${i?.id ?? ""}</code></td>
//             <td>${i?.domain ?? ""}</td>
//             <td>${String(i?.severity ?? "").toUpperCase()}</td>
//             <td class="${i?.passed ? "pass" : "fail"}">${i?.passed ? "PASS" : "FAIL"}</td>
//             <td>${i?.message ?? ""}</td>
//           </tr>
//         `).join("")}
//       </table>
//     </section>
//     </section>

//   </div>
// </body>
// </html>`;

// fs.writeFileSync(htmlOut, html);

// console.log("✅ Homepage contract reports generated:");
// console.log(jsonOut);
// console.log(htmlOut);

// type EvidenceRow = {
//   id: string;
//   pillar: string;
//   label?: string;
//   result: "PASS" | "FAIL" | "NOT_RUN";
//   value?: number;
//   threshold?: number;
//   units?: string;
//   evidence?: string;
//   at: string;
// };

// function generateReport(evidence: any[]) {
//   const rows = evidence as EvidenceRow[];

//   const failures = rows.filter(
//     r => r.result === "FAIL" && r.pillar !== "diagnostic"
//   );

//   const passes = rows.filter(
//     r => r.result === "PASS" && r.pillar !== "diagnostic"
//   );

//   const advisories = rows.filter(
//     r => r.result === "NOT_RUN" && r.pillar !== "diagnostic"
//   );

//   const diagnostics = rows.filter(
//     r => r.pillar === "diagnostic"
//   );

//   const lines: string[] = [];

//   /* --------------------------------------------------
//      CONTRACT SUMMARY
//   -------------------------------------------------- */
//   lines.push("Contract Summary");
//   lines.push("================");
//   lines.push(`Total checks: ${rows.length}`);
//   lines.push(`Passes: ${passes.length}`);
//   lines.push(`Failures: ${failures.length}`);
//   lines.push("");

//   /* --------------------------------------------------
//      BLOCKING FINDINGS
//   -------------------------------------------------- */
//   lines.push("Blocking Failures");
//   lines.push("-----------------");

//   if (failures.length === 0) {
//     lines.push("✅ No blocking failures");
//   } else {
//     for (const f of failures) {
//       lines.push(`❌ [${f.id}] ${f.label ?? "Failure"}`);
//     }
//   }

//   lines.push("");

//   /* --------------------------------------------------
//      ADVISORY SIGNALS
//   -------------------------------------------------- */

//   lines.push("Advisory Signals (Non-Blocking)");
//   lines.push("--------------------------------");

//   if (advisories.length === 0) {
//     lines.push("ℹ️ No advisory signals");
//   } else {
//     for (const a of advisories) {
//       lines.push(`⚠️ [${a.id}] ${a.label ?? "Advisory signal"}`);
//     }
//   }

//   lines.push("");

//   /* --------------------------------------------------
//      DIAGNOSTICS (NEW)
//   -------------------------------------------------- */

//   lines.push("Diagnostics (Non-Blocking, Explanatory)");
//   lines.push("---------------------------------------");

//   if (diagnostics.length === 0) {
//     lines.push("ℹ️ No diagnostic signals recorded");
//   } else {
//     // Diagnostic summary
//     lines.push(`Summary: ${diagnostics.length} diagnostic signal(s) recorded`);

//     const lcpDiagnostics = diagnostics.filter(d =>
//       d.id.startsWith("DIAG-LCP")
//     );

//     if (lcpDiagnostics.length > 0) {
//       lines.push(
//         `• LCP-related diagnostics: ${lcpDiagnostics.length}`
//       );
//     }

//     lines.push("");

//     // Detailed diagnostics
//     for (const d of diagnostics) {
//       lines.push(`• [${d.id}] ${d.label ?? "Diagnostic signal"}`);
//       if (d.evidence) {
//         lines.push(`  └ ${d.evidence}`);
//       }
//     }
//   }

//   lines.push("");

//   return lines.join("\n");
// }

// export function run() {
//   const outPath = path.resolve("reports/homepage.contract.report.txt");
//   const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
//   const report = generateReport(evidence);

//   fs.writeFileSync(outPath, report);
//   console.log(`✔ Contract report written to ${outPath}`);
// }
