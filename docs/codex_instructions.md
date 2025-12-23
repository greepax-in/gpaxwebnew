# codex_instructions.md
GreenPax Website — Codex Instruction Rulebook  
Version: 1.1  
This file must be obeyed by ChatGPT + VSCode Codex at all times.

---

## 📌 Purpose
This file defines how ChatGPT and VSCode Codex must generate, modify, or refactor code in the GreenPax website repository. It ensures:
- No code drift  
- No version mismatch  
- No folder structure changes  
- No CTA inconsistencies  
- No SEO regressions  
- No garbled characters  
- No performance regressions  

This rulebook works together with:
- `website_instructions.md`  
- `codex.json`  
- `codex_instructions.md` (this file)

---

## 🟥 0. Golden Rule — Mandatory CODEX Code Task Block
Every code generation must use this exact block:

```CODEX
# Task: <Short description>
# Files Modified:
# - <path/to/file1.tsx>
# - <path/to/file2.tsx>
# Files Created:
# - <path/to/new-file.tsx>
# Files Deleted:
# - <path/to/removed-file.tsx>

# Patch Start
<FULL FILE CONTENT OR DIFF>
# Patch End
````

Rules:

* File paths must be explicit and relative.
* ChatGPT must never output code without this block.
* Codex must reject code that does not follow this structure.

---

## 1️⃣ Version Alignment (Strict)

All generated code must use the exact versions in `package.json`:

```
Next.js 16.0.4
React 19.2.0
React DOM 19.2.0
@mui/material 7.3.5
@emotion/react 11.14.0
@emotion/styled 11.14.1
framer-motion 12.23.24
next-pwa 5.6.0 (only if PWA mode is selected)
```

No older or newer APIs may be used unless explicitly approved.

---

## 2️⃣ Folder Structure Enforcement

Allowed root architecture:

```
src/
  app/
  components/
  data/
  lib/
public/
codex.json
codex_instructions.md
website_instructions.md
```

❌ Not allowed:

* pages/
* app2/
* components-old/
* backup folders
* unapproved new top-level folders

✔️ Allowed:

* New subcomponents under `src/components/<Category>/`
* New utilities under `src/lib/`

Codex must block structural drift.

---

## 3️⃣ UX Non-Negotiable Rules

Codex & ChatGPT must enforce based on GreenPax rules:

### Ecommerce Mandatory Structure:

* Product card must include image, name, subtitle, "From ₹X", pack info, eco badges, variant badges, bulk hint.
* Category icon grid.
* Mobile-first Shopee/Lazada-style layout.

### WhatsApp CTA:

* Only **one unified ordering flow**.
* Must use a shared helper (e.g., `getWhatsAppLink()`).
* No “Add to Quote” unless implemented into same flow.
* Desktop & Mobile must match.

### Clean Copy:

* No garbled characters (`�`, `dY?`, `1;`, etc.)
* All text must be clean UTF-8.

---

## 4️⃣ SEO & Metadata Rules

Every page must include:

* `generateMetadata()`
* Title
* Description
* Canonical
* Open Graph tags
* JSON-LD Product Schema (product pages)

Codex must reject creation of new pages without metadata.

---

## 5️⃣ Rendering & Performance Requirements

* Use **Server Components** by default.
* AppBar and layout **must be SSR**.
* DO NOT use `dynamic(..., { ssr:false })` for core UI.
* Limit Framer Motion usage to micro interactions.
* Use `next/image` everywhere.
* Hero image on product page must use: `priority={true}`.
* Lazy-load non-critical images.

---

## 6️⃣ Data Integrity — items.json is Source of Truth

Rules:

* All pricing, packs, sizes, variants must come from `src/data/items.json`.
* No hardcoded values.
* Types must align with the JSON structure.
* Codex must block code if TypeScript errors appear.
* No ignoring type errors (remove ignoreBuildErrors).

---

## 7️⃣ API Hardening Requirements

If APIs are created:

* Must use **Zod** validation.
* POST only for mutating routes.
* Must sanitize inputs.
* Must include rate limiting.
* Must include honeypot anti-spam for forms.
* Must not log customer personal data (phone numbers, etc.)

---

## 8️⃣ PWA Strategy (One Mode Only)

### You must choose only ONE option:

#### Mode A (Recommended):

Full App Router PWA

* No `output: "export"`

#### Mode B (Simple Static Export):

* Keep `output: "export"`
* **Remove next-pwa** completely

Hybrid setups are forbidden.

---

## 9️⃣ Linting & TypeScript Strictness

* TypeScript strict mode required.
* ESLint must pass.
* No `ignoreBuildErrors`.
* Minimal/no `any`.

Codex must block PRs/code that violate these.

---

## 🔟 CODEx Blocking Rules (Non-Negotiable)

Codex must block code that:

* Breaks folder structure
* Removes metadata or SEO tags
* Adds multiple WhatsApp CTAs
* Uses unsupported Next.js/React APIs
* Introduces pages/ folder
* Adds broken UTF-8 characters
* Breaks SSR for AppBar/layout
* Hardcodes price or product info
* Removes items.json mapping
* Adds new API without validation
* Does not use CODEX Block Template

---

## 🧩 11. ChatGPT Code Generation Behavior

ChatGPT must:

1. Read all three rulebooks:

   * `website_instructions.md`
   * `codex_instructions.md`
   * `codex.json`
2. Validate the user request.
3. Warn if user request violates rules.
4. Always generate code inside a **CODEX block**.
5. Ensure correct file paths.
6. Ensure pages include SEO + metadata.
7. Ensure CTA logic remains consistent.
8. Ensure no type drift from items.json.

---

## ✔️ End of codex_instructions.md

Version 1.1
Author: GreenPax Architecture Governance

```

